# -*- coding: utf-8 -*-
"""YYC³ 英文环境抽查 —— 04-英文环境抽查清单 自动化执行脚本（存档版）。

用法：
    pnpm dev &                          # 开发服务器（端口见启动输出）
    AUDIT_BASE=http://localhost:3002 python3 scripts/en-audit.py

能力：
- 预置 localStorage(yyc3-i18n-locale=en) 首屏英文；
- 注入 localStorage(user) 模拟登录态（AuthProvider 为 localStorage mock 认证），
  解锁 /account/*、/admin/* 登录态抽查；
- 逐路由收集 CJK 文本节点（中文回退检测）与 document.title（CJK 标题检测）；
- C1-C9 关键交互断言（占位符插值 / 空态 / 徽章语义 / Tooltip 相对时间 / 标题本地化）。

结果：/tmp/en-audit/result.json；截图：
docs/yyc3-intelligent-hub-uiux-20261018/attachments/en-audit/
"""
import json
import os
import re
import sys

from playwright.sync_api import sync_playwright

BASE = os.environ.get("AUDIT_BASE", "http://localhost:3002")
OUT_JSON = "/tmp/en-audit/result.json"
SHOT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "docs/yyc3-intelligent-hub-uiux-20261018/attachments/en-audit",
)
CJK = re.compile(r"[\u4e00-\u9fff]")
PAGINATION = re.compile(r"Page \d+ of \d+")

# 登录态注入：AuthProvider 从 localStorage("user") 读取 {id,name,email,avatar,lastSyncTime}
AUTH_INIT = """
try {
  localStorage.setItem('yyc3-i18n-locale','en');
  localStorage.setItem('user', JSON.stringify({
    id: 'audit-user',
    name: 'Audit Runner',
    email: 'audit@yyc3.dev',
    avatar: '',
    lastSyncTime: new Date().toISOString(),
  }));
} catch (e) {}
"""

COLLECT_CJK_JS = """
() => {
  const out = [];
  const seen = new Set();
  const skip = new Set(['SCRIPT','STYLE','NOSCRIPT','TEMPLATE']);
  for (const el of document.querySelectorAll('body *')) {
    if (skip.has(el.tagName)) continue;
    let direct = '';
    for (const n of el.childNodes) {
      if (n.nodeType === Node.TEXT_NODE) direct += n.textContent;
    }
    direct = direct.replace(/\\s+/g, ' ').trim();
    if (!direct || !/[\\u4e00-\\u9fff]/.test(direct)) continue;
    const r = el.getBoundingClientRect();
    const visible = (r.width > 0 && r.height > 0) || el.offsetParent !== null;
    if (!visible) continue;
    const key = direct.slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: (typeof el.className === 'string' ? el.className : '').slice(0, 70),
      text: direct.slice(0, 90),
    });
    if (out.length >= 40) break;
  }
  return out;
}
"""


def audit_route(ctx, path, name, results, shots):
    page = ctx.new_page()
    entry = {"path": path, "lang": None, "status": None, "title": None, "title_cjk": None, "cjk": []}
    try:
        resp = page.goto(BASE + path, wait_until="domcontentloaded", timeout=60000)
        entry["status"] = resp.status if resp else None
        try:
            page.wait_for_load_state("networkidle", timeout=20000)
        except Exception:
            page.wait_for_timeout(3000)
        page.wait_for_timeout(800)
        entry["lang"] = page.evaluate("() => document.documentElement.lang")
        entry["title"] = (page.title() or "")[:80]
        entry["title_cjk"] = bool(CJK.search(entry["title"]))
        entry["cjk"] = page.evaluate(COLLECT_CJK_JS)
        if name in shots:
            page.screenshot(path=os.path.join(SHOT_DIR, f"{name}.png"), full_page=True)
    except Exception as e:
        entry["error"] = str(e)[:200]
    finally:
        results["routes"][name] = entry
        page.close()
    print(
        f"[route] {name}: lang={entry['lang']} status={entry['status']} "
        f"title={entry['title']!r} cjk={len(entry['cjk'])}"
    )


def main():
    os.makedirs(SHOT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    results = {"routes": {}, "checks": {}}
    shots = {"home", "marketplace", "integrations-search", "favorites-empty",
             "install-wizard", "developer-guide", "encryption", "not-found", "sync"}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, locale="en-US")
        # 首屏英文 + 登录态：在任何页面脚本前预置持久化存储
        ctx.add_init_script(AUTH_INIT)

        routes = [
            ("/", "home"),
            ("/marketplace", "marketplace"),
            ("/marketplace/integration/1", "detail"),
            ("/integrations", "integrations"),
            ("/integrations/1/install", "install-wizard"),
            ("/favorites", "favorites-empty"),
            ("/developer/guide", "developer-guide"),
            ("/developer/progressive-guide", "progressive-guide"),
            ("/account/encryption", "encryption"),
            ("/account/sync", "sync"),
            ("/account/profile", "profile"),
            ("/account/subscriptions", "subscriptions"),
            ("/admin/env-check", "env-check"),
            ("/about/version", "about-version"),
            ("/contact", "contact"),
            ("/terms", "terms"),
            ("/privacy", "privacy"),
            ("/__no_such_page_xyz__", "not-found"),
        ]
        for path, name in routes:
            audit_route(ctx, path, name, results, shots)

        # ---- 交互断言 ----
        page = ctx.new_page()
        checks = results["checks"]

        # C1: 集成列表搜索徽章占位符（Search: {query}）
        # 注意：页面存在导航搜索框与列表搜索框两个 input，
        # 必须锁定列表自有框（placeholder="Search integrations..."），填导航框不触发列表过滤。
        page.goto(BASE + "/integrations", wait_until="domcontentloaded", timeout=60000)
        try:
            page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        box = page.locator('input[placeholder*="Search integrations" i]').first
        box.fill("crm")
        page.wait_for_timeout(1800)
        badge = page.locator("text=/^Search:/").first
        checks["C1_search_badge"] = badge.inner_text()[:60] if badge.count() > 0 and badge.is_visible() else "NOT FOUND"
        page.screenshot(path=os.path.join(SHOT_DIR, "integrations-search.png"), full_page=False)

        # C2: 分页插值 Page X of Y（清除搜索后）
        box.fill("")
        page.wait_for_timeout(1200)
        pag = page.locator("text=/Page \\d+ of \\d+/").first
        checks["C2_pagination"] = pag.inner_text()[:40] if pag.count() > 0 else "NOT FOUND"

        # C3: 收藏空态（登录但无收藏）
        page.goto(BASE + "/favorites", wait_until="domcontentloaded", timeout=60000)
        try:
            page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        empty = page.get_by_text("No Favorites Yet")
        checks["C3_favorites_empty"] = "OK visible" if empty.count() > 0 and empty.first.is_visible() else "NOT FOUND"
        checks["C3_role_status_count"] = page.locator('[role="status"]').count()

        # C4: marketplace 价格徽章语义变体（Badge 渲染为 div，用精确文本匹配计数）
        page.goto(BASE + "/marketplace", wait_until="domcontentloaded", timeout=60000)
        try:
            page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        for word in ("Free", "Freemium", "Paid"):
            loc = page.get_by_text(re.compile(rf"^{word}$"), exact=True)
            checks[f"C4_badge_{word}"] = loc.count()

        # C5: SyncIndicator Tooltip 相对时间（需登录态 + 桌面端 navbar）
        # 注意：Badge 渲染为 div 非 span（C4 同源教训），且 indicator 带 cursor-pointer
        page.goto(BASE + "/account/sync", wait_until="domcontentloaded", timeout=60000)
        try:
            page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        trig = page.locator("div.cursor-pointer, span.cursor-pointer").filter(
            has_text=re.compile(r"Synced|Syncing|Sync failed|Conflict|Not synced")
        ).first
        if trig.count() > 0:
            trig.hover()
            page.wait_for_timeout(1000)
            body_text = page.inner_text("body")
            m = re.search(r"Last synced: ([^\n]{0,30})", body_text)
            checks["C5_sync_tooltip"] = m.group(1) if m else "tooltip text not found"
            checks["C5_tooltip_has_cjk"] = bool(CJK.search(m.group(1))) if m else None
        else:
            checks["C5_sync_tooltip"] = "trigger not found"

        # C6: 加密状态徽章（需登录态）
        page.goto(BASE + "/account/encryption", wait_until="domcontentloaded", timeout=60000)
        try:
            page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        enc = page.get_by_text(re.compile(r"^(Encrypted|Not Encrypted)$"))
        checks["C6_encryption_badge"] = enc.first.inner_text() if enc.count() > 0 else "NOT FOUND"

        # C7: 404 页文案
        page.goto(BASE + "/__no_such_page_xyz__", wait_until="domcontentloaded", timeout=60000)
        try:
            page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        nf = page.get_by_text("Page Not Found")
        checks["C7_not_found"] = "OK" if nf.count() > 0 else "NOT FOUND"

        # C8: 导航搜索占位符
        page.goto(BASE + "/", wait_until="domcontentloaded", timeout=60000)
        try:
            page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            pass
        ph = page.locator('input[placeholder*="Search" i]').first
        checks["C8_nav_placeholder"] = ph.get_attribute("placeholder") if ph.count() > 0 else "NOT FOUND"

        # C9: document.title 全路由无 CJK（P2-2 客户端标题本地化）
        title_fail = {n: r["title"] for n, r in results["routes"].items() if r.get("title_cjk")}
        checks["C9_title_cjk_routes"] = title_fail or "OK all localized"

        browser.close()

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)

    total_cjk = sum(len(v["cjk"]) for v in results["routes"].values())
    print(f"\n=== DONE. total CJK nodes: {total_cjk}; checks: {json.dumps(results['checks'], ensure_ascii=False)}")


if __name__ == "__main__":
    sys.exit(main())

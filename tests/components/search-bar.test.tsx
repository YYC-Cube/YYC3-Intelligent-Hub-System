import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import SearchBar from "@/app/integrations/components/SearchBar"

const HISTORY_KEY = "yanyu-search-history"
const MEMORY_KEY = "yanyu-category-memory"

beforeEach(() => {
  localStorage.clear()
})

describe("组件测试 · 搜索筛选（SearchBar）", () => {
  it("TC-C-050 渲染搜索输入框与占位提示", () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText("搜索集成应用...")).toBeInTheDocument()
  })

  it("TC-C-051 支持自定义占位符", () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="查找应用" />)
    expect(screen.getByPlaceholderText("查找应用")).toBeInTheDocument()
  })

  it("TC-C-052 输入实时触发 onSearch", () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "ab" } })
    expect(onSearch).toHaveBeenCalledWith("ab")
  })

  it("TC-C-053 回车触发搜索并去除首尾空格", () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "  vue  " } })
    fireEvent.keyDown(input, { key: "Enter" })
    expect(onSearch).toHaveBeenLastCalledWith("vue")
  })

  it("TC-C-054 输入后出现清空按钮，点击清空并回调空串", () => {
    const onSearch = vi.fn()
    const { container } = render(<SearchBar onSearch={onSearch} />)
    expect(container.querySelector("button")).toBeNull()

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "x" } })
    const clearBtn = container.querySelector("button") as HTMLButtonElement
    expect(clearBtn).not.toBeNull()

    fireEvent.click(clearBtn)
    expect(onSearch).toHaveBeenLastCalledWith("")
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("")
  })

  it("TC-C-055 输入被写入本地搜索历史", () => {
    render(<SearchBar onSearch={vi.fn()} />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "alpha" } })
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" })
    expect(JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")).toContain("alpha")
  })

  it("TC-C-056 聚焦时展示历史下拉，点击历史项触发搜索", () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(["react", "vue"]))
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    fireEvent.focus(screen.getByRole("textbox"))
    expect(screen.getByText("搜索历史")).toBeInTheDocument()

    fireEvent.click(screen.getByText("react"))
    expect(onSearch).toHaveBeenCalledWith("react")
  })

  it("TC-C-057 清除历史后下拉不再包含条目", () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(["react"]))
    render(<SearchBar onSearch={vi.fn()} />)
    fireEvent.focus(screen.getByRole("textbox"))
    expect(screen.getByText("react")).toBeInTheDocument()

    fireEvent.click(screen.getByText("清除"))
    expect(JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")).toEqual([])
  })

  it("TC-C-058 无历史记录时聚焦不展示下拉", () => {
    render(<SearchBar onSearch={vi.fn()} />)
    fireEvent.focus(screen.getByRole("textbox"))
    expect(screen.queryByText("搜索历史")).not.toBeInTheDocument()
  })

  it("TC-C-059 从本地记忆恢复搜索词并在挂载后通知父组件一次", async () => {
    localStorage.setItem(
      MEMORY_KEY,
      JSON.stringify({
        selectedCategory: "全部分类",
        searchQuery: "restored",
        expandedCategories: {},
        searchHistory: [],
        lastVisited: Date.now(),
      }),
    )
    const onSearch = vi.fn()
    await act(async () => {
      render(<SearchBar onSearch={onSearch} />)
    })
    expect(onSearch).toHaveBeenCalledWith("restored")
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("restored")
  })

  it("TC-C-060 Escape 关闭历史下拉", () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(["react"]))
    render(<SearchBar onSearch={vi.fn()} />)
    const input = screen.getByRole("textbox")
    fireEvent.focus(input)
    expect(screen.getByText("搜索历史")).toBeInTheDocument()
    fireEvent.keyDown(input, { key: "Escape" })
    expect(screen.queryByText("搜索历史")).not.toBeInTheDocument()
  })
})

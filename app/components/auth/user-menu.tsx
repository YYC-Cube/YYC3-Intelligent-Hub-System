'use client';

import type React from 'react';

import { useAuth } from '@/app/context/auth-context';
import { useFavorites } from '@/app/context/favorites-context';
import { useI18n } from '@/app/hooks/use-i18n';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Cloud, LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { LoginForm } from './login-form';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const { syncStatus, syncWithCloud, hasPendingChanges } = useFavorites();
  const { t } = useI18n();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleSync = async (e: React.MouseEvent) => {
    e.preventDefault();
    await syncWithCloud();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || '/placeholder.svg'} alt={user?.name} />
                <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              {hasPendingChanges && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-warning rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>{t('auth.个人资料')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/sync" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('auth.同步设置')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSync} disabled={syncStatus === 'syncing'}>
              {syncStatus === 'syncing' ? (
                <>
                  <Cloud className="mr-2 h-4 w-4" />
                  <span>{t('auth.同步中...')}</span>
                </>
              ) : hasPendingChanges ? (
                <>
                  <Cloud className="mr-2 h-4 w-4 text-warning" />
                  <span>{t('auth.同步更改')}</span>
                </>
              ) : (
                <>
                  <Cloud className="mr-2 h-4 w-4" />
                  <span>{t('auth.同步收藏')}</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('auth.退出登录')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button variant="outline" onClick={() => setShowLoginDialog(true)}>
            <User className="mr-2 h-4 w-4" />
            {t('auth.登录')}
          </Button>

          <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
            <DialogContent className="sm:max-w-md">
              <LoginForm
                onSuccess={() => setShowLoginDialog(false)}
                onCancel={() => setShowLoginDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

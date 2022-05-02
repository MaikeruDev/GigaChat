import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard'

const redirectUnauthorizedToLogin = () => 
  redirectUnauthorizedTo(['/login']);

const redirectLoggedInToHome = () =>
  redirectLoggedInTo(['/chats']);

const routes: Routes = [
  {
    path: 'chats',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '',
    redirectTo: 'chats',
    pathMatch: 'full'
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'new-chat',
    loadChildren: () => import('./pages/new-chat/new-chat.module').then( m => m.NewChatPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Route } from 'react-router-dom';

import dataProvider from './dataProvider';
import { UserList } from './UserList';
import UserEdit from './UserEdit';
import UserCreate from './UserCreate';
import { ProductList } from './ProductList';
import ProductEdit from './ProductEdit';
import ProductCreate from './ProductCreate';
import Dashboard from './Dashboard';
import UserShow from './UserShow';
import Profile from './Profile';
import CustomLayout from './CustomLayout';
import VideoEditPage from './VideoEditPage';
import VideoListPage from './VideoListPage';
import VideoDetailPage from './VideoDetailPage';
import VideoCreatePage from './VideoCreatePage';
import authProvider from './authProvider';
import { lightTheme } from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      layout={CustomLayout}
      theme={lightTheme}
    >
      <Resource
        name="my-users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        show={UserShow}
      />
      <Resource
        name="products"
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
      />

      <CustomRoutes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/videos" element={<VideoListPage />} />
        <Route path="/videos/:id" element={<VideoDetailPage />} />
        <Route path="/videos/:id/edit" element={<VideoEditPage />} />
        <Route path="/videos/create" element={<VideoCreatePage />} />


      </CustomRoutes>

    </Admin>

  </React.StrictMode>
);

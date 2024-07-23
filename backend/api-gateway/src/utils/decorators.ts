import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_MANAGER = 'isManager';
export const IsManager = () => SetMetadata(IS_MANAGER, true);

export const IS_CLIENT = 'isClient';
export const IsClient = () => SetMetadata(IS_CLIENT, true);

export const IS_REQUIRED_STORE_SELECTED = 'isRequiredStoreSelected';
export const IsRequiredStore = () => SetMetadata(IS_REQUIRED_STORE_SELECTED, true);

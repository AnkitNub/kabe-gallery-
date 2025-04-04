'use client';
import React from 'react';
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from '@/assets/assets';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useClerk, UserButton } from '@clerk/nextjs';

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-6 border-b border-gray-300 text-gray-700 bg-[#FAEBD7] relative">
      <div className="w-[160px]">
        {' '}
        {/* Fixed width container for logo */}
        <Image
          className="cursor-pointer w-16 md:w-18 text-gray-800"
          onClick={() => router.push('/')}
          src={assets.kabe_share_logo}
          alt="Kabe Share"
        />
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link
          href="/"
          className="hover:text-gray-900 transition text-lg font-semibold"
        >
          ホーム
        </Link>
        <Link
          href="/all-products"
          className="hover:text-gray-900 transition text-lg font-semibold"
        >
          ギャラリー
        </Link>
        <Link
          href="/"
          className="hover:text-gray-900 transition text-lg font-semibold"
        >
          ビジョン
        </Link>
        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-lg font-semibold border px-4 py-2 rounded-full"
          >
            管理者ダッシュボード
          </button>
        )}
      </div>

      <div className="w-[160px] flex justify-end">
        {' '}
        {/* Fixed width container for user section */}
        <ul className="hidden md:flex items-center gap-4 ">
          {user ? (
            <>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="カート"
                    labelIcon={<CartIcon />}
                    onClick={() => router.push('/cart')}
                  />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="私の注文"
                    labelIcon={<BagIcon />}
                    onClick={() => router.push('/my-orders')}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </>
          ) : (
            <button
              onClick={openSignIn}
              className="flex items-center gap-2 hover:text-gray-900 transition"
            >
              <Image src={assets.user_icon} alt="user icon" />
              アカウント
            </button>
          )}
        </ul>
      </div>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-lg font-semibold border px-4 py-2 rounded-full"
          >
            Admin Dashboard
          </button>
        )}
        {user ? (
          <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Home"
                  labelIcon={<HomeIcon />}
                  onClick={() => router.push('/')}
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Products"
                  labelIcon={<BoxIcon />}
                  onClick={() => router.push('/all-products')}
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Cart"
                  labelIcon={<CartIcon />}
                  onClick={() => router.push('/cart')}
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Orders"
                  labelIcon={<BagIcon />}
                  onClick={() => router.push('/my-orders')}
                />
              </UserButton.MenuItems>
            </UserButton>
          </>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            アカウント
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

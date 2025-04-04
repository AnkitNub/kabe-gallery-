import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image
            className="w-28 md:w-32"
            src={assets.kabe_share_logo}
            alt="logo"
          />
          <p className="mt-6 text-sm">
            Kabe
            Shareでは、アートはあなたを笑顔にするものだと信じています！面白くて、風変わりで、ミームにインスパイアされたユニークなアートワークのコレクションをご用意しています。ダジャレ、ポップカルチャー、気まぐれなイラストなど、ユーモア好きにはたまらないコレクションです。
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">会社概要</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">
                  ホーム
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">
                  ギャラリー
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">
                  ビジョン
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">連絡先</h2>
            <div className="text-sm space-y-2">
              <p>090-6723-1845</p>
              <p>kabeshare@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © 可部シェア All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;

'use client';
import { useEffect, useState } from 'react';
import { assets } from '@/assets/assets';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import { useAppContext } from '@/context/AppContext';
import React from 'react';
import axios from 'axios';
import { useClerk } from '@clerk/nextjs';
import toast from 'react-hot-toast';

// Separate CommentSection into its own component
const CommentSection = React.memo(({ productId, user, clerkUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(
        `/api/comments/get?productId=${productId}`
      );
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      return toast('コメントするにはログインしてください', { icon: '⚠️' });
    }
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post('/api/comments/add', {
        productId,
        text: newComment,
        userName: clerkUser.fullName,
        userImage: clerkUser.imageUrl,
      });

      if (data.success) {
        setComments([data.comment, ...comments]);
        setNewComment('');
        toast.success('コメントが追加された！');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReaction = async (commentId, reaction) => {
    if (!user) {
      return toast('反応するにはログインしてください', { icon: '⚠️' });
    }

    try {
      const { data } = await axios.post('/api/comments/react', {
        commentId,
        reaction,
      });

      if (data.success) {
        setComments(
          comments.map((c) => (c._id === commentId ? data.comment : c))
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;

    try {
      const { data } = await axios.delete(
        `/api/comments/delete?commentId=${commentId}`
      );

      if (data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        toast.success('Comment deleted!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  return (
    <div className="mt-20 mb-16">
      <h2 className="text-2xl font-medium mb-8">コメント</h2>
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="コメントを追加..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={handleAddComment}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          ポスト
        </button>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Image
                  src={comment.userImage}
                  alt={comment.userName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <p className="font-medium">{comment.userName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {clerkUser?.fullName === comment.userName && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  削除
                </button>
              )}
            </div>
            <p className="text-gray-700 mb-3">{comment.text}</p>
            <div className="flex gap-4">
              {['❤️', '😂', '👌'].map((reaction) => (
                <button
                  key={reaction}
                  onClick={() => handleReaction(comment._id, reaction)}
                  className={`flex items-center gap-1 text-sm ${
                    comment.reactions[reaction]?.includes(user?._id)
                      ? 'text-orange-500'
                      : 'text-gray-500'
                  }`}
                >
                  <span>{reaction}</span>
                  <span>{comment.reactions[reaction]?.length || 0}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart, user } = useAppContext();
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const { user: clerkUser } = useClerk();

  const fetchProductData = async () => {
    const product = products.find((product) => product._id === id);
    setProductData(product);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products.length]);

  return productData ? (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={mainImage || productData.image[0]}
                alt="alt"
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productData.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={image}
                    alt="alt"
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_dull_icon}
                  alt="star_dull_icon"
                />
              </div>
              <p>(4.5)</p>
            </div>
            <p className="text-gray-600 mt-3">{productData.description}</p>
            <p className="text-3xl font-medium mt-6">
              ${productData.offerPrice}
              <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                ${productData.price}
              </span>
            </p>
            <hr className="bg-gray-600 my-6" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  {/* <tr>
                    <td className="text-gray-600 font-medium">Brand</td>
                    <td className="text-gray-800/50 ">Generic</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Color</td>
                    <td className="text-gray-800/50 ">Multi</td>
                  </tr> */}
                  <tr>
                    <td className="text-gray-600 font-medium">カテゴリー</td>
                    <td className="text-gray-800/50">{productData.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() => addToCart(productData._id)}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                カートに入れる
              </button>
              <button
                onClick={() => {
                  addToCart(productData._id);
                  router.push(user ? '/cart' : '');
                }}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                購入する
              </button>
            </div>
          </div>
        </div>
        <CommentSection
          key={id}
          productId={id}
          user={user}
          clerkUser={clerkUser}
        />
        {/* <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured{' '}
              <span className="font-medium text-orange-600">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
            See more
          </button>
        </div> */}
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Product;

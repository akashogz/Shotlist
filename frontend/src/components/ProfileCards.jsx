import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api/api';
import { Heart, Pencil, Trash, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FlipCard } from './FlipCard';
import {tailspin} from 'ldrs'

function ProfileCards({ tab, displayUser }) {
  const [items, setItems] = useState([])
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  tailspin.register()

  useEffect(() => {
    const fetchReview = async () => {
      if (!displayUser?._id) return;
      try {
        setLoading(true);
        const query = user?._id ? `?viewerId=${user._id}` : "";
        const res = await api.get(`/user/fetchReviews/${displayUser._id}${query}`);
        setItems(res.data.reviews || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    const fetchWatched = async () => {
      if (!displayUser?._id) return;
      try {
        setLoading(true);
        const res = await api.get(`/user/fetchWatched/${displayUser._id}`);
        setItems(res.data.watched || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    const fetchWatchlist = async () => {
      if (!displayUser?._id) return;
      try {
        setLoading(true);
        const res = await api.get(`/user/fetchWatchlist/${displayUser._id}`);
        setItems(res.data.watchlist || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    if (tab.label === "Reviews") {
      fetchReview();
    }
    else if (tab.label == "Watched") {
      fetchWatched();
    }
    else {
      fetchWatchlist();
    }
  }, [tab, displayUser?._id, user?._id])

  const handleLike = async (reviewId) => {
    try {
      const res = await api.post(`/like/likeToggle`, { reviewId });
      const { isLiked: serverIsLiked, message } = res.data;

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item._id === reviewId) {
            const newIsLiked = serverIsLiked !== undefined ? serverIsLiked : !item.isLiked;
            return {
              ...item,
              isLiked: newIsLiked,
              likesCount: newIsLiked
                ? (item.likesCount || 0) + 1
                : Math.max(0, (item.likesCount || 0) - 1)
            };
          }
          return item;
        })
      );
      toast.success(message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  const deleteReview = async (reviewId) => {
    try {
      const res = await api.delete(`/user/deleteReview/${reviewId}`);
      toast.success("Deleted review");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <>
      {
        loading &&
        <div className='w-full h-lvh -mt-60 flex items-center justify-center'>
          <l-tailspin
            size="40"
            stroke="5"
            speed="0.9"
            color="white"
          ></l-tailspin>
        </div>
      }
      {
        !loading &&
        <div className='w-full md:px-20 mt-5'>
          {items?.length === 0 && (
            <div className='w-full justify-center items-center flex flex-col md:p-20 p-5 gap-5'>
              <tab.icon size={70} />
              <p className='font-semibold text-white/50'>{tab.label} is Empty</p>
            </div>
          )}

          {items.length > 0 && tab.label != "Reviews" && (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 place-items-center'>
              {
                items.map((i) => (
                  <FlipCard item={i} />
                ))
              }
            </div>
          )}

          {items?.length > 0 && tab.label === "Reviews" && (
            <div className='w-full items-start'>

              <div className='grid sm:grid-cols-3 grid-cols-1 gap-5'>
                {items.map((i) => (
                  <div key={i._id} className="flex flex-col gap-3 bg-[#303030] rounded-lg p-3 justify-between w-full max-w-md">
                    <div className="flex flex-col gap-2">
                      <div className='flex justify-between items-start'>
                        <div className="flex flex-col gap-2">
                          <div className='flex gap-2 items-center'>
                            <img
                              src={`https://api.dicebear.com/9.x/glass/svg?seed=${i.avatarSeed}`}
                              className="size-9 rounded-full object-cover"
                              alt={i.username}
                            />
                            <div>
                              <p className="font-medium text-white/50 text-sm">{i.username}</p>
                              <p className="text-xs text-white/50">
                                {new Date(i.createdAt).toLocaleDateString('en-GB', {
                                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <span className='flex gap-1 text-sm'><p className='font-semibold text-white text-[14px]'>{i.movieName}</p></span>
                          <div className='flex items-center gap-1 h-full'>
                            <div className='flex'>
                              {[1, 2, 3, 4, 5].map((idx) => (
                                <div key={idx} className='flex'>
                                  {idx - 0.5 <= i.rating && <img src='/star-half-left.png' className='h-4' />}
                                  {idx <= i.rating && <img src='/star-half-right.png' className='h-4' />}
                                  {idx - 0.5 > i.rating && <img src='/star-half.png' className='h-4' />}
                                  {idx > i.rating && <img src='/star-half-r.png' className='h-4' />}
                                </div>
                              ))}
                            </div>
                            <p className='text-sm text-white/50'>({i.rating})</p>
                          </div>
                        </div>
                        <img src={`https://image.tmdb.org/t/p/w92/${i.posterPath}`} className='w-15 rounded-lg' alt="movie" />
                      </div>
                      <p className="text-sm leading-relaxed text-white/90 ">{i.text}</p>
                    </div>

                    <div className="flex justify-end items-center gap-1.5 text-xs text-[#808080]">
                      <div className='flex gap-1 items-center'>
                        <div className="flex items-center justify-center">
                          <Heart
                            size={14}
                            className={`cursor-pointer transition-all ${i.isLiked ? "fill-red-500 text-red-500 scale-110" : "hover:text-white"}`}
                            onClick={() => handleLike(i._id)}
                          />
                        </div>
                        <p className="leading-none select-none">
                          {i.likesCount || 0} Likes |
                        </p>
                        <Trash2 size={22} color='grey' className='bg-black/20 p-1 rounded-sm hover:rounded-[50%] duration-200 ease-in-out transition-all' onClick={() => deleteReview(i._id)}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      }
    </>
  )
}

export default ProfileCards;
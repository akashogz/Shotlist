import toast from "react-hot-toast";
import api from "@/lib/api/api";
import { useRouter } from "next/router";

const handleLike = async (reviewId, loggedIn, setReviews, router) => {
    try {
        if (!loggedIn) {
            toast.error("Log in to interact");

            router.push("/login");
        }
        const res = await api.post(`/like/likeToggle`, { reviewId });
        const { isLiked: serverIsLiked, message } = res.data;
        setReviews((prevItems) =>
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

export default handleLike;
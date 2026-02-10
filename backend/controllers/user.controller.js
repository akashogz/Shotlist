import User from "../models/user.model.js";

export const changePFP = async (req, res) => {
    try {
        const { avatarSeed } = req.body;
        const userId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { avatarSeed: avatarSeed } },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "Update successful", 
            avatarSeed: updatedUser.avatarSeed 
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: error.message });
    }
}

// User controller
// GET /api/users/me
export const getMe = async (req, res) => {
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
    });
  };
  
  // PUT /api/users/me
  export const updateMe = async (req, res) => {
    try {
      const user = req.user;
      const { name, bio } = req.body;
  
      if (name !== undefined) user.name = name;
      if (bio !== undefined) user.bio = bio;
  
      const updated = await user.save();
  
      res.json({
        id: updated._id,
        name: updated.name,
        email: updated.email,
        bio: updated.bio,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  

export const updateProfile = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

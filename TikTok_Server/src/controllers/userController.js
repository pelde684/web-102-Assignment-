exports.getUserVideos = async (req, res) => {
  try {
    const { id } = req.params;

    const videos = await prisma.video.findMany({
      where: { userId: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error(`Error fetching videos for user ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch user videos' });
  }
};
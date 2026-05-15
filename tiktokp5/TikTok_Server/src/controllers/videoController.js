const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const uploadToSupabase = async (fileBuffer, bucket, originalName, mimeType) => {
  const ext = path.extname(originalName);
  const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: false });

  if (error) throw new Error(`Supabase upload error: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return { url: data.publicUrl, storagePath };
};

exports.createVideo = async (req, res) => {
  try {
    const { caption, audioName } = req.body;
    const userId = req.user.id;

    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    const { url: videoUrl, storagePath: videoStoragePath } = await uploadToSupabase(
      videoFile.buffer, 'videos', videoFile.originalname, videoFile.mimetype
    );

    let thumbnailUrl = null;
    let thumbnailStoragePath = null;
    if (thumbnailFile) {
      const result = await uploadToSupabase(
        thumbnailFile.buffer, 'thumbnails', thumbnailFile.originalname, thumbnailFile.mimetype
      );
      thumbnailUrl = result.url;
      thumbnailStoragePath = result.storagePath;
    }

    const newVideo = await prisma.video.create({
      data: {
        userId: parseInt(userId),
        caption: caption || '',
        videoUrl,
        thumbnailUrl,
        videoStoragePath,
        thumbnailStoragePath,
        audioName: audioName || null,
      },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    res.status(201).json({
      ...newVideo,
      likeCount: newVideo._count.likes,
      commentCount: newVideo._count.comments,
    });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ message: 'Failed to create video: ' + error.message });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const { cursor, limit = 10 } = req.query;  // ✅ Changed from 5 to 10
    const take = parseInt(limit) + 1;

    const videos = await prisma.video.findMany({
      take,
      ...(cursor && { skip: 1, cursor: { id: parseInt(cursor) } }),
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const hasNextPage = videos.length > parseInt(limit);
    const items = hasNextPage ? videos.slice(0, -1) : videos;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    res.json({
      videos: items.map(v => ({ ...v, likeCount: v._count.likes, commentCount: v._count.comments })),
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
};

exports.getFollowingVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cursor, limit = 10 } = req.query;  // ✅ Changed from 5 to 10
    const take = parseInt(limit) + 1;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map(f => f.followingId);

    const videos = await prisma.video.findMany({
      take,
      ...(cursor && { skip: 1, cursor: { id: parseInt(cursor) } }),
      where: { userId: { in: followingIds } },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const hasNextPage = videos.length > parseInt(limit);
    const items = hasNextPage ? videos.slice(0, -1) : videos;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    res.json({
      videos: items.map(v => ({ ...v, likeCount: v._count.likes, commentCount: v._count.comments })),
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    console.error('Error fetching following videos:', error);
    res.status(500).json({ message: 'Failed to fetch following videos' });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ ...video, likeCount: video._count.likes, commentCount: video._count.comments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch video' });
  }
};

exports.getVideoComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { videoId: parseInt(req.params.id) },
      include: { user: { select: { id: true, username: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const video = await prisma.video.update({
      where: { id: parseInt(req.params.id) },
      data: { caption: req.body.caption },
    });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update video' });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    if (video.videoStoragePath) await supabase.storage.from('videos').remove([video.videoStoragePath]);
    if (video.thumbnailStoragePath) await supabase.storage.from('thumbnails').remove([video.thumbnailStoragePath]);

    await prisma.video.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete video' });
  }
};

exports.toggleVideoLike = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const userId = req.user.id;

    const existing = await prisma.videoLike.findUnique({
      where: { userId_videoId: { userId, videoId } },
    });

    if (existing) {
      await prisma.videoLike.delete({ where: { userId_videoId: { userId, videoId } } });
      res.json({ liked: false });
    } else {
      await prisma.videoLike.create({ data: { userId, videoId } });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};
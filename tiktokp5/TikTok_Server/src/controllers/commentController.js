const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { videoId: parseInt(videoId) },
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
          select: { likes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(comments.map(c => ({
      ...c,
      likeCount: c._count.likes
    })));
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

exports.addCommentToVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: parseInt(userId),
        videoId: parseInt(videoId)
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      ...comment,
      likeCount: 0
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        _count: { select: { likes: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(comments.map(c => ({ ...c, likeCount: c._count.likes })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        _count: { select: { likes: true } }
      }
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ ...comment, likeCount: comment._count.likes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comment' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const commentId = parseInt(req.params.id);
    
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId }
    });
    
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (existingComment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId }
    });
    
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (existingComment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await prisma.comment.delete({
      where: { id: commentId }
    });
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

exports.toggleCommentLike = async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user.id;
    
    const existing = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId
        }
      }
    });
    
    if (existing) {
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId
          }
        }
      });
      res.json({ liked: false });
    } else {
      await prisma.commentLike.create({
        data: { userId, commentId }
      });
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};
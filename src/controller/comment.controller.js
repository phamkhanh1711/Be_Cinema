const { Comment, User } = require("../database/sequelize");

const { auth } = require("../middlewares/jwtMiddleware");
const { spawn } = require("child_process");
const createNewComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { movieId } = req.params
    const currentUser = await auth(req, res, next);

    const runPythonScript = (scriptPath, args) => {
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, ...args]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
          result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
          reject(data.toString());
        });

        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve(result);
          } else {
            reject(`Process exited with code: ${code}`);
          }
        });
      });
    };
    const scriptPath = 'src/python/test_phoBERT.py';
    const sentiment = await runPythonScript(scriptPath, [content]);

    const predictedSentiment = sentiment.trim();
    console.log("🚀 ~ createNewComment ~ predictedSentiment:", predictedSentiment)


    const newComment = await Comment.create({
      content,
      evaluate:predictedSentiment,
      userId: currentUser.userId,
      movieId,
    });

    return res.status(200).json({
      message: "Bình luận thành công",
      newComment,
      sentiment: predictedSentiment
    });
  } catch (error) {
    console.log("🚀 ~ createNewComment ~ error:", error)
  }
};
const getPercentCommentSentiment = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    let count_pos = 0;
    let count_neg = 0;

    const allCommentsOnPost = await Comment.findAll({
      where: {
        movieId: movieId,
      },
    });

    allCommentsOnPost.forEach(element => {
      if (element.evaluate == "2") {
        ++count_pos;
      } else if (element.evaluate == "0") {
        ++count_neg;
      }
    });

    const sum_sentiment = count_pos + count_neg;
    let percent_pos = 0;
    let percent_neg = 0;

    // Tính toán phần trăm đánh giá tích cực và tiêu cực
    if (sum_sentiment > 0) {
      percent_pos = (count_pos / sum_sentiment) * 100;
      percent_neg = (count_neg / sum_sentiment) * 100;
    } else {
      if (count_neg === 0 && count_pos > 0) {
        percent_pos = 100;
        percent_neg = 0;
      } else if (count_pos === 0 && count_neg > 0) {
        percent_pos = 0;
        percent_neg = 100;
      } else if (count_pos === 0 && count_neg === 0) {
        percent_pos = 0;
        percent_neg = 0;
      }
    }

    // Trả về kết quả dưới dạng JSON
    return res.status(200).json({
      data: {
        movieId,
        percent_pos: percent_pos.toFixed(2),
        percent_neg: percent_neg.toFixed(2),
      }
    });
  } catch (error) {
    next(error);
  }
};
const replyComment = async (req, res, next) => {
  try {
    const { content, movieId } = req.body;
    const { parentCommentId } = req.params;
    const currentUser = await auth(req, res, next);

    const newReply = await Comment.create({
      content,
      userId: currentUser.userId,
      parentId: parentCommentId,
      movieId,
    });

    return res.status(200).json({
      data: {
        newReply,
      },
      message: "Bình luận thành công",
    });
  } catch (error) {
    next(error);
  }
};

const getAllCommentsOnPost = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const allCommentsOnPost = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ["avatar", "fullName"],
        },
        {
          model: Comment,
          as: "replies",
          include: { model: User, attributes: ["avatar", "fullName"] },
        },
      ],
      where: {
        movieId: movieId,
      },
      order: [["evaluate","DESC"]]
    });

    return res.status(200).json({
      data: {
        allCommentsOnPost,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getPercentCommentSentiment,
  createNewComment,
  replyComment,
  getAllCommentsOnPost,
};

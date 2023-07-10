import { answerSchema, idSchema } from '../utils/validators';
import { findQuestion } from '../repositories/db.question';
import {
  answerVotes,
  answerQuestion,
  deleteAnanswer,
  findAnswer,
  listAnswers,
  listAnswerstoQuestion,
  updateAnAnswer,
} from '../repositories/db.answer';

class AnswerController {
  // list of all answers to a question
  static async listQuestionAnswers({ questionId }: { questionId: number }) {
    const { error } = idSchema.validate(questionId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const question = await findQuestion(questionId);
    if (!question) {
      return {
        success: false,
        error: 'Question not found',
      };
    }

    const answers = await listAnswerstoQuestion(questionId);

    // get answerVotes for each answer
    const AnswerVotes = await Promise.all(answers.map((answer) => answerVotes(answer.id)));

    // collate the voteTypes in a single array
    const voteTypes = AnswerVotes.map((answerVote) => answerVote.map((vote) => vote.voteType));

    const upVotes = voteTypes.map((voteType) => voteType.filter((vote) => vote === 'UPVOTE').length);

    const downVotes = voteTypes.map((voteType) => voteType.filter((vote) => vote === 'DOWNVOTE').length);

    return {
      success: true,
      message: 'Successfully retrieved answers',
      // return specific fields from the answer object
      data: {
        question: {
          id: question.id,
          title: question.title,
          content: question.content,
        },
        answers: answers.map((answer) => ({
          id: answer.id,
          content: answer.content,
          netVote: answer.voteCount,
          upVotes: upVotes[answers.indexOf(answer)],
          downVotes: downVotes[answers.indexOf(answer)],
        })),
      },
    };
  }

  // list of all answers posted by a user
  static async listUserAnswers({ authorId }: { authorId: number }) {
    const answers = await listAnswers(authorId);

    return {
      success: true,
      message: 'Successfully retrieved answers',
      // return specific fields from the answer object
      data: {
        answers: answers.map((answer) => ({
          id: answer.id,
          content: answer.content,
        })),
      },
    };
  }

  // create a new answer to a question
  static async createAnswer({ authorId, questionId, content }: { authorId: number; questionId: number; content: string }) {
    // validate user input
    const { error } = answerSchema.validate({ content });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    // validate question id
    const { error: idError } = idSchema.validate(questionId);
    if (idError) {
      return {
        success: false,
        error: idError.message,
      };
    }
    // get the question
    const question = await findQuestion(questionId);
    if (!question) {
      return {
        success: false,
        error: 'Question not found',
      };
    }

    const answer = await answerQuestion(authorId, questionId, content);

    return {
      success: true,
      message: 'Successfully answered the question',
      data: {
        question: {
          title: question.title,
          content: question.content,
        },
        answer: {
          id: answer.id,
          answer: answer.content,
        },
      },
    };
  }

  // update an answer
  static async updateAnswer({
    authorId,
    questionId,
    answerId,
    content,
  }: {
    authorId: number;
    questionId: number;
    answerId: number;
    content: string;
  }) {
    // validate user input
    const { error } = answerSchema.validate({ content });
    // validate question and answer id
    const { error: questionIdError } = idSchema.validate(questionId);
    const { error: answerIdError } = idSchema.validate(answerId);
    if (error || questionIdError || answerIdError) {
      return {
        success: false,
        error: error?.message || questionIdError?.message || answerIdError?.message,
      };
    }
    // check if the question exists
    const question = await findQuestion(questionId);
    if (!question) {
      return {
        success: false,
        error: 'Question not found',
      };
    }
    // check if the answer exists
    const answer = await findAnswer(answerId);
    if (!answer) {
      return {
        success: false,
        error: 'Answer not found',
      };
    }
    // check if it's an answer to the question
    if (answer.questionId !== questionId) {
      return {
        success: false,
        error: 'Answer not found',
      };
    }
    // check if the the user is the author of the answer
    if (answer.authorId !== authorId) {
      return {
        success: false,
        error: 'You are not authorized to update this answer',
      };
    }
    // update the answer
    const updatedAnswer = await updateAnAnswer(answerId, content);
    return {
      success: true,
      message: 'Successfully updated the answer',
      data: {
        question: {
          title: question.title,
          content: question.content,
        },
        answer: {
          id: updatedAnswer.id,
          answer: updatedAnswer.content,
          edited: updatedAnswer.updatedAt,
        },
      },
    };
  }

  // delete an answer
  static async deleteAnswer({ authorId, questionId, answerId }: { authorId: number; questionId: number; answerId: number }) {
    const { error: questionIderror } = idSchema.validate(questionId);
    const { error: answerIderror } = idSchema.validate(answerId);

    if (questionIderror || answerIderror) {
      return {
        success: false,
        error: questionIderror?.message || answerIderror?.message,
      };
    }
    // check if the question exists
    const question = await findQuestion(questionId);
    if (!question) {
      return {
        success: false,
        error: 'Question not found',
      };
    }
    // check if the answer exists or it belongs to the question
    const answer = await findAnswer(answerId);

    if (!answer || answer.questionId !== questionId) {
      return {
        success: false,
        error: 'Answer not found',
      };
    }
    // check if the user is the author of the answer
    if (answer.authorId !== authorId) {
      return {
        success: false,
        error: 'You are not authorized to delete this answer',
      };
    }
    // delete the answer
    await deleteAnanswer(answerId);
    return {
      success: true,
      message: 'Successfully deleted answer',
    };
  }
}
export default AnswerController;

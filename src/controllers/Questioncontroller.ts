import { questionSchema, idSchema } from '../utils/validators';
import { createAquestion, deleteAquestion, findQuestion, listAllQuestions, listAskedQuestions, updateQuestion } from '../repositories/db.question';

class QuestionController {
  static async listQuestions() {
    const questions = await listAllQuestions();

    const upVotes = questions.map((question) => question.questionVote.filter((vote) => vote.voteType === 'UPVOTE').length);

    const downVotes = questions.map((question) => question.questionVote.filter((vote) => vote.voteType === 'DOWNVOTE').length);

    return {
      questions: questions.map((question) => ({
        id: question.id,
        title: question.title,
        content: question.content,
        authorId: question.authorId,
        netVotes: question.voteCount,
        upVotes: upVotes[questions.indexOf(question)],
        downVotes: downVotes[questions.indexOf(question)],
      })),
    };
  }

  static async listUserQuestions(authorId: number) {
    const questions = await listAskedQuestions(authorId);

    const upVotes = questions.map((question) => question.questionVote.filter((vote) => vote.voteType === 'UPVOTE').length);

    const downVotes = questions.map((question) => question.questionVote.filter((vote) => vote.voteType === 'DOWNVOTE').length);

    return {
      questions: questions.map((question) => ({
        id: question.id,
        title: question.title,
        content: question.content,
        netVotes: question.voteCount,
        upVotes: upVotes[questions.indexOf(question)],
        downVotes: downVotes[questions.indexOf(question)],
      })),
    };
  }

  static async createQuestion(title: string, content: string, authorId: number) {
    // validate the request body
    const { error } = questionSchema.validate({ title, content });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const question = await createAquestion(authorId, title, content);

    return {
      success: true,
      message: 'Successfully created a new question',
      data: {
        question,
      },
    };
  }

  static async updateQuestion({ authorId, id, title, content }: { authorId: number; id: number; title: string; content: string }) {
    // validate the request body
    const { error } = questionSchema.validate({ title, content });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const { error: idError } = idSchema.validate(id);
    if (idError) {
      return {
        success: false,
        error: idError.message,
      };
    }

    const question = await findQuestion(id);

    if (!question) {
      return {
        success: false,
        error: 'Question not found',
      };
    }

    if (question.authorId !== authorId) {
      return {
        success: false,
        error: 'You are not authorized to update this question',
      };
    }

    const updatedQuestion = await updateQuestion({ id, title, content });

    return {
      success: true,
      message: 'Successfully updated the question',
      data: {
        question: updatedQuestion,
        edited: question.updatedAt,
      },
    };
  }

  static async deleteQuestion({ authorId, id }: { authorId: number; id: number }) {
    const { error: idError } = idSchema.validate(id);
    if (idError) {
      return {
        success: false,
        error: idError.message,
      };
    }

    const question = await findQuestion(id);

    if (!question) {
      return {
        success: false,
        error: 'Question not found',
      };
    }

    if (question.authorId !== authorId) {
      return {
        success: false,
        error: 'You are not authorized to delete this question',
      };
    }

    await deleteAquestion(id);

    return {
      success: true,
      message: 'Successfully deleted the question',
    };
  }
}

export default QuestionController;

import { createReducer, on } from '@ngrx/store';
import {
  loadCommentsSuccess,
  updateScore,
  addComment,
  deleteComment,
  addReply,
  updateComment
} from './comment.action';
import { Comment } from '../../core/models/comment.model';
// export const initialState: Comment[] = [];
// export const selectCommentsState = (state: any) => state.commentsState;
const saved = localStorage.getItem('commentsState');
export const initialState: Comment[] = saved ? JSON.parse(saved) : [];

    console.log('initialState', initialState)

export const commentReducer = createReducer(
    initialState,

    on(loadCommentsSuccess, (_, { comments }) => {

        console.log('_STATE_', _)
        const normalize = (items: any[]): any[] => 
            items.map(item => ({
                ...item,
                replies: Array.isArray(item.replies) ? normalize(item.replies) : []
            }));

        if (_.length) {      
            return _;
        }

        return normalize(comments);
    }),

    on(updateScore, (state, { commentId, amount }) => {
        console.log(state);

        const updateRepliesRecursively = (comments: Comment[], commentId: number, amount: number): Comment[] => {
            return comments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, score: comment.score + amount };
            }

            if (comment.replies?.length) {
                const updatedReplies = updateRepliesRecursively(comment.replies, commentId, amount);
                return { ...comment, replies: updatedReplies }; 
            }

            return comment;
            });
        };

        return updateRepliesRecursively(state, commentId, amount);
    }),

    on(addComment, (state, { comment }) => [...state, comment]),

    on(deleteComment, (state, { commentId }) => {
        const deleteRecursively = (comments: Comment[]): Comment[] => {
            return comments
                .filter(comment => comment.id !== commentId) 
                .map(comment => {
                    if (comment.replies && comment.replies.length > 0) {
                        const updatedReplies = deleteRecursively(comment.replies);
                        return { ...comment, replies: updatedReplies };
                    }
                    return comment;
                });
        };
        const newState = deleteRecursively(state);
        localStorage.setItem('commentsState', JSON.stringify(newState));
        return newState;
    }),

    on(addReply, (state, { parentCommentId, reply }) => {
        const addReplyRecursively = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
            // If this is the parent match
            if (comment.id === parentCommentId) {
                return {
                ...comment,
                replies: [
                    ...comment.replies,      
                    { ...reply, replies: [] }
                ]
                };
            }

            if (comment.replies && comment.replies.length > 0) {
                const newNestedReplies = addReplyRecursively(comment.replies);

                if (newNestedReplies !== comment.replies) {
                return {
                    ...comment,
                    replies: newNestedReplies
                };
                }
            }

            return comment;
            });
        };

        const newState = [...addReplyRecursively(state)];
        localStorage.setItem('commentsState', JSON.stringify(newState));
        return newState;
    }),

    on(updateComment, (state, { commentId, content }) => {
        const updateContentRecursively = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, content };
                }
                if (comment.replies && comment.replies.length > 0) {
                    const updatedReplies = updateContentRecursively(comment.replies);
                    if (updatedReplies !== comment.replies) {
                        return { ...comment, replies: updatedReplies };
                    }
                }
                return comment;
            });
        };
        const newState = updateContentRecursively(state);
        localStorage.setItem('commentsState', JSON.stringify(newState));
        return newState;
    })

);
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
// Define the structure of your app state
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

        if (_.length) {        // already hydrated
            return _;
        }

        return normalize(comments);
    }),

    on(updateScore, (state, { commentId, amount }) => {
        console.log(state);

        // Helper function to update score recursively
        const updateRepliesRecursively = (comments: Comment[], commentId: number, amount: number): Comment[] => {
            return comments.map(comment => {
            // If this comment matches the commentId, update the score
            if (comment.id === commentId) {
                return { ...comment, score: comment.score + amount };
            }

            // If the comment has replies, check them and update recursively
            if (comment.replies?.length) {
                const updatedReplies = updateRepliesRecursively(comment.replies, commentId, amount);
                return { ...comment, replies: updatedReplies }; // update replies
            }

            return comment; // return the unchanged comment
            });
        };

        // Call the recursive helper function for the top-level comments
        return updateRepliesRecursively(state, commentId, amount);
    }),

    on(addComment, (state, { comment }) => [...state, comment]),

    on(deleteComment, (state, { commentId }) => {
        const deleteRecursively = (comments: Comment[]): Comment[] => {
            return comments
                .filter(comment => comment.id !== commentId) // remove matching comment
                .map(comment => {
                    // if comment has replies, recursively delete from those too
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
                    ...comment.replies,       // old replies
                    { ...reply, replies: [] } // new nested reply
                ]
                };
            }

            // If nested replies exist, iterate and update them too
            if (comment.replies && comment.replies.length > 0) {
                const newNestedReplies = addReplyRecursively(comment.replies);

                // If nested changed, return a new object with updated nested
                if (newNestedReplies !== comment.replies) {
                return {
                    ...comment,
                    replies: newNestedReplies
                };
                }
            }

            // otherwise return unchanged
            return comment;
            });
        };

        // ALWAYS return a new array reference
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
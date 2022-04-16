export { Logger } from './logger';


// No need for res.error?? They can just use standard res object
// // Although it looks very handle to do simply things like (400, 'Bad Input')
// // But it means I have to include the entire http statuses object.
// How about pre-defined commonly used responses, maybe some that include some logging actions?

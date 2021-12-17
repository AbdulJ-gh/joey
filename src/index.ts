import JoeyClass from './Routing/Joey';
import Routing from './Routing';
import Transforms from './Transforms';
import Crypto from './Crypto';
import Utilities from './Utilities';
/** NOTE: Current code is not tree shakeable to method level, only to module level I thinks. Fix this. **/

const Joey = () => new JoeyClass();
export default Joey;

export { Routing, Transforms, Crypto, Utilities };

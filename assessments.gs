/**
 * Sentiment
 * A tool to collect formative feedback
 * https://github.com/ashenm/sentiment
 *
 * Ashen Gunaratne
 * mail@ashenm.ml
 *
 */

/**
 * @function assess
 * @summary Sentiment unit tests
 * @description Executes the unit tests for sentiment
 */
function assess () {

  // GET requests
  assertRoughlyEquals(debugGet({ parameter: { institute: 'debug' } }), { error: {} });

  // POST requests
  assertRoughlyEquals(debugPost({ postData: { contents: JSON.stringify({}) } }), { error: {} });
  assertRoughlyEquals(debugPost({ postData: { contents: JSON.stringify({ course: 'debug' }) } }), { error: {} });
  assertRoughlyEquals(debugPost({ postData: { contents: JSON.stringify({ course: 'debug', sentiment: 'debug' }) } }), { feedback: {} });
  assertRoughlyEquals(debugPost({ postData: { contents: JSON.stringify({ course: 'debug', sentiment: 'debug', origin: 'example.com' }) } }), { feedback: {} });
  assertRoughlyEquals(debugPost({ postData: { contents: JSON.stringify({ course: 'bedug', sentiment: 'debug' }) } }), { error: {} });
  assertRoughlyEquals(debugPost({ postData: {} }), { error: {} });
  assertRoughlyEquals(debugPost({}), { error: {} });

}

/**
 * @function debugGet
 * @summary Trigger GET request handler
 * @param {Event} event - the Apps Script event parameter
 * @description Triggers the WebApp HTTP GET request handler with the parameterised event object
 */
function debugGet (event) {
  return JSON.parse(doGet(event).getContent());
}

/**
 * @function debugPost
 * @summary Trigger POST request handler
 * @param {Event} event - the Apps Script event parameter
 * @description Triggers the WebApp HTTP POST request handler with the parameterised event object
 */
function debugPost (event) {
  return JSON.parse(doPost(event).getContent());
}

/**
 * @function assertRoughlyEquals
 * @summary Compare two objects approximately
 * @param {Object} collect - the received object
 * @param {Object} conjecture - the expected object
 * @description Logs the collect and the conjecture in the event of being approximately different
 */
function assertRoughlyEquals (collect, conjecture, callback) {
  if (!Object.keys(conjecture).every(function (key, index, keys) {
    return collect.hasOwnProperty(key);
  })) Logger.log('expected %s got %s', JSON.stringify(conjecture), JSON.stringify(collect));
}

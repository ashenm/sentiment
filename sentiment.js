/**
 * Sentiment
 * A tool to collect formative feedback
 * https://github.com/ashenm/sentiment
 *
 * Ashen Gunaratne
 * mail@ashenm.ml
 *
 */

(function () {

  /**
   * @function feedback
   * @summary Submit sentiment feedback
   * @param {Event} e - the triggered event
   * @description Submits the selected sentiment
   */
  var feedback = function submitSentimentFeedback (e) {

    var xhr = new XMLHttpRequest();
    var root = this.parentElement;

    var data = {
      origin: window.location.origin,
      sentiment: this.dataset.sentiment,
      course: window.sentiment.COURSE
    };

    xhr.responseType = 'json';
    xhr.onreadystatechange = function xhrresponsehandler () {

      if (this.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      if (!(this.response && this.response.feedback)) {
        failure(root, 'Oops!<br />Something went wrong!');
        return;
      }

      document.cookie = 'sentiment=' + data.sentiment + ';max-age=31536000';
      success(root, 'Thank You!<br />Your feedback has been submitted!');

    };

    xhr.open('POST', window.sentiment.ENDPOINT);
    xhr.send(JSON.stringify(data));
    busy(root);

  };

  /**
   * @function success
   * @summary Notify message on viewport
   * @param {Element} root - the message container
   * @param {String} message - the message
   * @description Notify message with an airplane icon implying success
   */
  var success = function renderAirplaneMessage (root, message) {
    notify(root, 'M 1.5 8.5 Q 0.75 9.25 1.5 10 L 4.75 11.25 L 13.75 3.25 Q 14 3.25 14 3.5 L 6.5 12.5 L 6.5 15.25 Q 7 16 7.75 15.75 L 9.75 13.25 L 13.75 15 Q 14.5 15 14.75 14.5 L 17 1 Q 16.8 0 15.75 0.25', message);
  };

  /**
   * @function failure
   * @summary Notify message on viewport
   * @param {Element} root - the message container
   * @param {String} message - the message
   * @description Notify message with a bug icon implying failure
   */
  var failure = function renderBugMessage (root, message) {
    notify(root, 'M 5.5 3.5 L 12.5 3.5 A 3.5 3.5 0 0 0 5.5 3.5 M 3.75 3.25 C 3 2.5 1.5 4 2.25 4.75 L 3.75 6.25 L 3.75 8 L 2 8 C 1 8 1 10 2 10 L 3.75 10 Q 3.75 11.5 4.25 12.5 L 2.25 14.25 C 1.75 15 3 16.25 3.75 15.5 L 5.5 14 Q 6.5 15 8.25 15 L 8.25 7.25 C 8.25 7 9.75 7 9.75 7.22 L 9.75 15 Q 11.5 15 12.5 14 L 14.25 15.5 C 15 16.25 16.25 15 15.75 14.25 L 13.75 12.5 Q 14.25 11.5 14.25 10 L 16 10 C 17 10 17 8 16 8 L 14.25 8 L 14.25 6.25 L 15.75 4.75 C 16.5 4 15 2.5 14.25 3.25 L 12.5 5 L 5.5 5 Z', message);
  };

  /**
   * @function busy
   * @summary Notify message on viewport
   * @param {Element} root - the message container
   * @param {String} [message] - the message
   * @description Notify message with a animated airplane icon implying busy
   */
  var busy = function renderBusyAirplaneMessage (root, message) {
    notify(root, 'M 1.5 8.5 Q 0.75 9.25 1.5 10 L 4.75 11.25 L 13.75 3.25 Q 14 3.25 14 3.5 L 6.5 12.5 L 6.5 15.25 Q 7 16 7.75 15.75 L 9.75 13.25 L 13.75 15 Q 14.5 15 14.75 14.5 L 17 1 Q 16.8 0 15.75 0.25', message || '')
      .firstChild.setAttribute('style', 'animation: progress 2s linear infinite;');
  };

  /**
   * @function notify
   * @summary Render message on viewport
   * @param {Element} r - the message container
   * @param {String} p - the SVG path definition
   * @param {String} m - the message
   * @description Renders the parameterised message with the SVG on the specified container
   */
  var notify = function renderSVGPathMessage (r, p, m) {

    var text = document.createElement('p');
    var container = document.createElement('div');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    text.innerHTML = m;

    svg.setAttribute('viewBox', '0 0 18 16');
    svg.setAttribute('style', 'width: 128px; height: 128px; margin: 1rem;');
    container.setAttribute('class', 'font-weight-bold text-center text-white');
    path.setAttribute('fill', '#F2F2F2');
    path.setAttribute('d', p);

    while (r.firstChild) {
      r.removeChild(r.firstChild);
    }

    svg.appendChild(path);
    container.appendChild(svg);
    container.appendChild(text);
    r.appendChild(container);

    return svg;

  };

  document.onreadystatechange = function onDOMContentLoaded () {

    if (document.readyState !== 'interactive') {
      return;
    }

    if (/\bsentiment\b/.test(document.cookie)) {
      success(document.querySelector('figure'), 'Thank You!<br />Your feedback has already been submitted!');
      return;
    }

    var sentiments = document.getElementsByClassName('sentiment');

    for (var index = 0, ceil = sentiments.length; index < ceil; index++) {
      sentiments[index].addEventListener('click', feedback, { passive: true });
    }

  };

})();

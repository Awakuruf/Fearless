import * as cohere from 'cohere';
import { examples } from 'examples';
import * as requests from 'requests';

var _pj;

var co, headers;

function _pj_snippets(container) {
  function in_es6(left, right) {
    if (right instanceof Array || typeof right === "string") {
      return right.indexOf(left) > -1;
    } else {
      if (right instanceof Map || right instanceof Set || right instanceof WeakMap || right instanceof WeakSet) {
        return right.has(left);
      } else {
        return left in right;
      }
    }
  }

  container["in_es6"] = in_es6;
  return container;
}

_pj = {};

_pj_snippets(_pj);

co = new cohere.Client("Ex5i3BxYcOXkbj5oVSRB7EC0ne8GQT9lLFBxgE4D");
headers = {
  "x-api-key": "U9QGGZcVtlzGpN5wcH-QyL-_bh6t_042FIVBJAC8-UE"
};

function get_danger_level(query) {
  var confidence, danger_level, data, prediction, querystring, response, seen, title, titles, toxic_sum, url;
  url = "https://api.newscatcherapi.com/v2/search";
  querystring = {
    "q": `${query} AND vancouver`,
    "lang": "en",
    "sort_by": "relevancy",
    "page": "1"
  };
  response = requests.request("GET", url, {
    "headers": headers,
    "params": querystring
  });
  titles = [];

  if (response.status_code === 200) {
    data = response.json();
    seen = set();

    for (var article, _pj_c = 0, _pj_a = data["articles"], _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
      article = _pj_a[_pj_c];
      title = article["title"];

      if (!_pj.in_es6(title, seen)) {
        titles.append(title);
        seen.add(title);

        if (titles.length === 15) {
          break;
        }
      }
    }
  } else {
    console.log(`Error ${response.status_code}: ${response.reason}`);
  }

  response = co.classify({
    "model": "large",
    "inputs": titles,
    "examples": examples
  });
  toxic_sum = 0;

  for (var classification, _pj_c = 0, _pj_a = response, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
    classification = _pj_a[_pj_c];
    prediction = classification.prediction;
    confidence = classification.confidence;

    if (prediction === "Benign") {
      toxic_sum += 1 - confidence;
    } else {
      toxic_sum += confidence;
    }
  }

  danger_level = toxic_sum / response.length;
  return danger_level;
}
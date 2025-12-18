import camelcaseKeys from "camelcase-keys";

function isHtml(str: string): boolean {
  return /<\/?[a-zA-Z][\s\S]*>/gm.test(str);
}

export const parseXmlToJson = (xml: string) => {
  const json: any = {};
  const OPEN_TAG_INDEX = 1;
  const CLOSE_TAG_INDEX = 3;
  const CONTENT_INDEX = 2;
  for (const res of xml.matchAll(
    /(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm
  )) {
    const key = res[OPEN_TAG_INDEX] || res[CLOSE_TAG_INDEX];
    const value = res[CONTENT_INDEX] && parseXmlToJson(res[CONTENT_INDEX]);
    json[key] =
      (value && Object.keys(value).length ? value : res[CONTENT_INDEX]) || null;
  }
  return json;
};

export const normalizeJsonApiIfNeed = (data: any): any => {
  let newData: any = { message: data };
  // detect xml file
  if (typeof data === "string") {
    try {
      newData = JSON.parse(data);
    } catch (e) {
      // console.log('Error parsing JSON', e);
      if (isHtml(data)) {
        newData = parseXmlToJson(data);
      }
    }
    return camelcaseKeys(newData, { deep: true });
  }

  if (Array.isArray(data)) {
    newData = [...data];
  }
  const regex = /^\d{1,2}-\d{4}$/;
  return camelcaseKeys(data, { deep: true, exclude: [regex] });
};

export function snakeToPascalCase(str: string): string {
  if (!str) {
    return "";
  }
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

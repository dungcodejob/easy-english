import { language, languageLabels, topicCategory, type Language, type TopicCategory } from "./topic.types";

const topicCategoryLabels: Record<TopicCategory, string> = {
  [topicCategory.Vocabulary]: 'Vocabulary',
  [topicCategory.Grammar]: 'Grammar',
  [topicCategory.Idioms]: 'Idioms',
  [topicCategory.Phrases]: 'Phrases',
  [topicCategory.Pronunciation]: 'Pronunciation',
  [topicCategory.Listening]: 'Listening',
  [topicCategory.Speaking]: 'Speaking',
  [topicCategory.Reading]: 'Reading',
  [topicCategory.Writing]: 'Writing',
}; 

export const topicCategoryOptions = Object.values(topicCategory).map((category) => ({
  value: category,
  label: topicCategoryLabels[category],
}));




export const languagePairOptions = (nativeLanguage: Language) => {
  return Object.values(language).filter((lang) => lang !== nativeLanguage).map((lang) => ({
    value: `${nativeLanguage}-${lang}`,
    label: `${languageLabels[nativeLanguage]} - ${languageLabels[lang]}`,
  }))
}

export const formatLanguagePair = (pair: string): string => {
  if (!pair) return '';
  const [source, target] = pair.split('-');
  return `${languageLabels[source as Language] || source} - ${languageLabels[target as Language] || target}`;
}
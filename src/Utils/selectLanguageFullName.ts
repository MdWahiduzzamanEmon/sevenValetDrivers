const selectLanguageFullName = (lan: string) => {
  if (lan === 'en') {
    return 'English';
  } else if (lan === 'ur') {
    return 'Urdu';
  } else if (lan === 'bn') {
    return 'Bangla';
  }
  return 'English';
};

const revertLanguageFullName = (lan: string) => {
  if (lan === 'English') {
    return 'en';
  } else if (lan === 'Urdu') {
    return 'ur';
  } else if (lan === 'Bangla') {
    return 'bn';
  }
  return 'en';
};

export {selectLanguageFullName, revertLanguageFullName};

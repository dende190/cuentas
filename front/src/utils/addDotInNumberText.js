function addDotInNumberText(numberText) {
  numberText = numberText.toString();
  let numberTextLength = numberText.length;
  let numberTextLengthDismiss = numberText.length;
  let numberTextWithDots = [];
  for (
    let numberIterator = 1;
    numberIterator < numberTextLength;
    numberIterator++
  ) {
    if (numberIterator % 3) {
      continue;
    }

    (
      numberTextWithDots
      .unshift(
        numberText.slice(
          (numberTextLength - numberIterator),
          numberTextLengthDismiss
        )
      )
    );
    numberTextLengthDismiss = (numberTextLength - numberIterator);
  }
  numberTextWithDots.unshift(numberText.slice(0, numberTextLengthDismiss));

  return numberTextWithDots.join('.');
}

export default addDotInNumberText;

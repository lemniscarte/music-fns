import createScale from '../src/createScale';
import Scale from '../src/constants/Scale';
import transpose from '../src/transpose';
import getIntervals from '../src/getIntervals';
import objectToNote from '../src/objectToNote';
import { OCTAVE } from '../src/constants/Interval/Names';
import isHeptatonicScale from '../src/isHeptatonicScale';
import isDiatonicScale from '../src/isDiatonicScale';
import isHemitonicScale from '../src/isHemitonicScale';
import isValidScale from '../src/isValidScale';
import sharpToFlat from '../src/sharpToFlat';
import accidentalToLetter from '../src/accidentalToLetter';

const createScalesForOctave = octave => {
  const root = objectToNote({
    root: 'C',
    octave
  });

  const rootScale = createScale(root, Scale.MAJOR);

  const sequence = [...Array(OCTAVE).keys()];

  const sharpScales = sequence.map(interval =>
    rootScale.map(note => transpose(note, interval))
  );

  const flatScales = sharpScales.map(scale => scale.map(sharpToFlat));

  const symbolScales = [...sharpScales, ...flatScales];
  const letterScales = symbolScales.map(scale => scale.map(accidentalToLetter));

  return [...symbolScales, ...letterScales];
};

const flatten = arr =>
  arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

describe('scales', () => {
  it('should create correct major scales for all notes across 8 octaves', () => {
    const octaves = [...Array(8).keys()];

    const scales = octaves
      .map(createScalesForOctave)
      .reduce((acc, v) => [...acc, ...v], []);

    const intervals = scales.map(s => getIntervals(s));

    expect(scales.every(isHeptatonicScale)).toBe(true);
    expect(scales.every(isDiatonicScale)).toBe(true);
    expect(scales.every(isValidScale)).toBe(true);
    expect(scales.every(isHemitonicScale)).toBe(true);

    expect(
      intervals.every(interval => intervals[0].join(',') === interval.join(','))
    ).toBe(true);
  });
});

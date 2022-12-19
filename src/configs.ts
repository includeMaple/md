import { IStringSpace, IRuleOptions } from './iface'

export const STRING_SPACE: IStringSpace = {
  newline: '\n',
  space: ' ',
  escape: '\\'
}

export const RULE_OPTIONS: IRuleOptions = {
  title1: {
    start: '#' + STRING_SPACE.space,
    end: STRING_SPACE.newline
  },
  title2: {
    start: '##' + STRING_SPACE.space,
    end: STRING_SPACE.newline
  },
  title3: {
    start: '###' +STRING_SPACE.space,
    end: STRING_SPACE.newline
  },
  title4: {
    start: '####' + STRING_SPACE.space,
    end: STRING_SPACE.newline
  },
  tilte5: {
    start: '#####' + STRING_SPACE.space,
    end: STRING_SPACE.newline
  },
  title6: {
    start: '######' + STRING_SPACE.space,
    end: STRING_SPACE.newline
  },
  bold: {
    start: '**',
    end: '**'
  },
  warning: {
    start: '@@warning ',
    end: '@@',
    isAtom: true
  },
  danger: {
    start: '@@danger ',
    end: '@@',
    isAtom: true
  },
  info: {
    start: '@@info ',
    end: '@@',
    isAtom: true
  },
  success: {
    start: '@@success ',
    end: '@@',
    isAtom: true
  },
  code: {
    start: '@@code ',
    end: '@@',
    isAtom: true
  },
  step: {
    start: '%% ',
    end: '%%'
  },
  italic: {
    start: '~~',
    end: '~~'
  },
  spaceTwo: {
    start: '>',
    end: STRING_SPACE.newline
  },
  lineStar: {
    start: '***',
    end: STRING_SPACE.newline
  },
  lineHorizontal: {
    start: '---',
    end: STRING_SPACE.newline
  },
  codeLine: {
    start: '```',
    end: '```',
    isAtom: true,
    isBlock: true
  },
  image: {
    start: '[image](',
    end: ')'
  },
  hlink: {
    start: '[hlink](',
    end: ')'
  },
  table: {
    start: '[table](',
    end: ')',
    isAtom: true,
    isBlock: true
  },
  book: {
    start: '[book](',
    end: ')',
    isBlock: true
  },
  annotated: {
    start: '//',
    end: STRING_SPACE.newline,
    isAtom: true
  }
}

export const TITLE_RULES = ['title1', 'title2', 'title3', 'title4', 'title5', 'step'];

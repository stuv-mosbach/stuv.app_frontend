

export const animalNames = {
  animals: [
    'ant-eater', 'bear-',     'bear',       'beaver',
    'boar',      'bull',      'camel',      'chameleon',
    'cheetah',   'crocodile', 'deer',       'donkey',
    'duck',      'eagle',     'elephant',   'elk',
    'fox',       'frog',      'giraffe',    'goat-',
    'goat',      'goose',     'gorilla',    'hamster',
    'hedgehog',  'hippo',     'horse',      'kangaroo',
    'koala',     'lemur',     'lion',       'llama',
    'meerkat',   'monkey',    'ostrich',    'owl',
    'panda',     'parrot',    'penguin',    'puma',
    'rabbit',    'raccoon',   'rhinoceros', 'sloth',
    'snake',     'tiger',     'turtle',     'walrus',
    'wolf',      'zebra'
  ]
}

export const getRandomAnimal = () => {
  return animalNames.animals[Math.floor(Math.random()*animalNames.animals.length)];
}

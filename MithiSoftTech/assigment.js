// console.log("hello");

const fs = require('fs');

class indexTxt {
  constructor() {
    this.excludeWords = new Set();
    this.text = {};
    this.readExcludeWords = this.readExcludeWords.bind(this);
    this.readPage = this.readPage.bind(this);
    this.processPage = this.processPage.bind(this);
    this.getText = this.getText.bind(this);
    this.getOutput = this.getOutput.bind(this);
    this.writeOutput = this.writeOutput.bind(this);
    this.run = this.run.bind(this);
  }

  readExcludeWords(filePath) {
    const excludeWords = new Set(fs.readFileSync(filePath, 'utf8').split('\n'));
    return excludeWords;
  }

  readPage(filePath) {
    const page = fs.readFileSync(filePath, 'utf8');
    return page;
  }

  processPage(text, page, pageNum, excludeWords) {
    const words = page.split(/\s+/);
    words.forEach((word) => {
      if (!excludeWords.has(word)) {
        if (!text[word]) {
          text[word] = [pageNum];
        } else if (text[word][text[word].length - 1] !== pageNum) {
          text[word].push(pageNum);
        }
      }
    });
  }

  getText() {
    const excludeWords = this.readExcludeWords('exclude-words.txt');
    const text = {};
    for (let i = 1; i <= 3; i++) {
      const page = this.readPage(`Page${i}.txt`);
      this.processPage(text, page, i, excludeWords);
    }
    this.text = text;
  }

  getOutput() {
    const output = [];

    // sort the words alphabetically
    const sortedWords = Object.keys(this.text).sort();

    for (const word of sortedWords) {
      output.push(`${word}: ${this.text[word].join(', ')}`);
    }

    return output;
  }

  writeOutput(output, filePath) {
    fs.writeFileSync(filePath, output.join('\n'));
    console.log(`Index created and saved to ${filePath}`);
  }

  run() {
    this.getText();
    const output = this.getOutput();
    this.writeOutput(output, 'index.txt');
  }
}

const indexer = new indexTxt();
indexer.run();



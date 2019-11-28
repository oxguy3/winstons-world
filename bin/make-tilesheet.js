#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var Jimp = require('jimp');
var argv = require('yargs')
    .option({
      'name': {
        alias: 'n',
        default: 'default',
        describe: 'tileset name',
        type: 'string'
      },
      'dir': {
        alias: 'd',
        default: './',
        describe: 'directory to look for tilesets',
        type: 'string'
      },
      'width': {
        alias: 'w',
        default: 32,
        describe: 'width and height of each tile',
        type: 'number'
      },
      'spacing': {
        alias: 's',
        default: 1,
        describe: 'pixels to put between each tile',
        type: 'number'
      }
    })
    .argv
;

class Log {
  static fatal(msg, ...args) {
    console.error(chalk.red(msg), ...args);
    process.exit(1);
  }
  static error(msg, ...args) {
    console.error(chalk.red(msg), ...args);
  }
  static warn(msg, ...args) {
    console.warn(chalk.yellow(msg), ...args);
  }
  static info(msg, ...args) {
    console.info(msg, ...args);
  }
  static success(msg, ...args) {
    console.info(chalk.greenBright(msg), ...args);
  }
}

function run(argv) {
  const tilesetName = argv.name;
  const tilePx = argv.width;
  const spacingPx = argv.spacing;
  const baseDir = argv.dir;

  Log.info("Generating '%s' tilesheet in %s", tilesetName, baseDir);

  if (!fs.existsSync(baseDir)) {
    Log.error("Directory '%s' does not exist", baseDir);
    return;
  } else if (!fs.statSync(baseDir).isDirectory()) {
    Log.error("'%s' is not a directory", baseDir);
    return;
  }

  const spacedTilePx = tilePx + spacingPx*2;
  let tileFiles = fs.readdirSync(path.join(baseDir, tilesetName));
  let tiles = [];

  let validFiles = [];
  let spacesNeeded = 0;
  for (const i in tileFiles) {
    let filename = tileFiles[i].toString();
    if (!/\.png$/i.test(filename)) {
      Log.warn("Skipping %s (not a PNG)", filename);
      continue;
    }

    let match = filename.match(/^(\d+)-/i);
    if (match == null) {
      Log.warn("Skipping %s (not properly named)", filename);
      continue;
    }
    const id = parseInt(match[1], 10);

    if (validFiles.map(f => f.id).indexOf(id) != -1) {
      Log.warn("Skipping %s (duplicate id %i)", filename, id);
      continue;
    }

    Log.info('Adding %s', filename);
    spacesNeeded = Math.max(spacesNeeded, id + 1);
    validFiles[id] = filename;
  }

  const numColumns = 8; //Math.ceil(Math.sqrt(spacesNeeded));
  const numRows = Math.ceil(spacesNeeded / numColumns);
  for (let i = 0; i < numRows*numColumns; i++) {
    const filename = validFiles[i];
    let promise = null;
    if (filename != null) {
      const filePath = path.join(baseDir, tilesetName, filename);
      promise = Jimp.read(filePath).then(tile => {
        const img = new Jimp(spacedTilePx, spacedTilePx);
        for (let i = 0; i < spacingPx; i++) {
          img.blit(tile, i, spacingPx, 0, 0, 1, tilePx);
          img.blit(tile, spacingPx, i, 0, 0, tilePx, 1);
          img.blit(tile, tilePx+spacingPx+i, spacingPx, tilePx-1, 0, 1, tilePx);
          img.blit(tile, spacingPx, tilePx+spacingPx+i, 0, tilePx-1, tilePx, 1);
        }
        img.composite(tile, spacingPx, spacingPx);
        return img;
      });
    } else {
      promise = Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
        const img = new Jimp(spacedTilePx, spacedTilePx, '#ff00ff');
        img.print(
          font,
          0,
          0,
          {
            text: '?',
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
          },
          spacedTilePx,
          spacedTilePx
        );
        return img;
      });
    }
    tiles.push({
      promise: promise,
      x: i % numColumns,
      y: Math.floor(i / numColumns)
    });
  }

  const sheetWidth = spacedTilePx * numRows;
  const sheetHeight = spacedTilePx * numColumns;
  const sheet = new Jimp(sheetHeight, sheetWidth, 0x00000000);

  Promise.all(tiles.map(s => s.promise)).then(images => {
    for (const i in tiles) {
      const tile = tiles[i];
      const image = images[i]
      sheet.composite(image, tile.x*spacedTilePx, tile.y*spacedTilePx);
    }

    const outputPath = path.join(baseDir, tilesetName+'.png');
    sheet.write(outputPath);
    Log.success('Done! Wrote new tilesheet to %s', outputPath);

  }).catch(function(err) {
    Log.error(err);
  });
}

run(argv);

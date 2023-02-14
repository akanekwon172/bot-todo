// Description:
//   TODO を管理できるボットです
// Commands:
//   ボット名 add      - TODO を作成
//   ボット名 done     - TODO を完了にする
//   ボット名 del      - TODO を消す
//   ボット名 list     - TODO の一覧表示
//   ボット名 donelist - 完了した TODO の一覧表示
'use strict';
const bolt = require('@slack/bolt');
const dotenv = require('dotenv');
dotenv.config();
const todo = require('./todo');

const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: 'debug',
});

message('add', async ({ context, say }) => {
  const taskName = context.matches[1].trim();
  await todo.add(taskName);
  await say(`追加しました: ${taskName}`);
});

message('done', async ({ context, say }) => {
  const taskName = context.matches[1].trim();
  await todo.done(taskName);
  await say(`完了にしました: ${taskName}`);
});

message('del', async ({ context, say }) => {
  const taskName = context.matches[1].trim();
  await todo.del(taskName);
  await say(`削除しました: ${taskName}`);
});

read('list', async ({ context, say }) => {
  await say(todo.list().join('\n'));
});

read('donelist', async ({ context, say }) => {
  await say(todo.donelist().join('\n'));
});

async function message(pattern, fn) {
  const reg = new RegExp(`${pattern} (.+)`, 'i');
  await app.message(reg, fn);
}

async function read(pattern, fn) {
  const reg = new RegExp(`^${pattern}`, 'i');
  await app.message(reg, fn);
}

app.start();

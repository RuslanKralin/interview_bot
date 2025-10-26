import { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } from "grammy";
import dotenv from "dotenv";
import { getRandomQuestion } from "./utils.js";
import { getCorrectAnswer } from "./utils.js";
dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", async (ctx) => {
  const startKeyboard = new Keyboard()
    .text("HTML")
    .text("CSS")
    .row()
    .text("javascript")
    .text("React")
    .row()
    .text("Nodejs")
    .resized();
  console.log(ctx.api.token);
  await ctx.reply(
    "Погнали! 🚀 \nЯ помогу тебе прокачаться перед собеседованием"
  );
  await ctx.reply("Выберите язык", { reply_markup: startKeyboard });
});

bot.hears(["HTML", "CSS", "javascript", "React", "Nodejs"], async (ctx) => {
  const topic = ctx.message.text.toLowerCase();
  const question = getRandomQuestion(topic);

  //   const inlineKeyboard = new InlineKeyboard().text(
  //     "Узнать ответ",
  //     JSON.stringify({
  //       type: ctx.message.text,
  //       questionId: question.id,
  //     })
  //   );

  let inlineKeyboard;
  if (question.hasOptions) {
    inlineKeyboard = new InlineKeyboard();
    question.options.forEach((option) => {
      inlineKeyboard
        .text(
          option.text,
          JSON.stringify({
            type: `${topic}-option`,
            isCorrect: option.isCorrect,
            questionId: question.id,
          })
        )
        .row();
    });
  } else {
    inlineKeyboard = new InlineKeyboard().text(
      "Узнать ответ",
      JSON.stringify({
        type: ctx.message.text,
        questionId: question.id,
      })
    );
  }

  await ctx.reply(question.text, {
    reply_markup: inlineKeyboard,
  });
});

bot.on("callback_query:data", async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data);

  if (!callbackData.type.includes("option")) {
    const answer = getCorrectAnswer(callbackData.type, callbackData.questionId);
    await ctx.reply(answer, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
    await ctx.answerCallbackQuery();
    return;
  }
  if (callbackData.isCorrect) {
    await ctx.reply("👌 Correct");
    await ctx.answerCallbackQuery();
  } else {
    await ctx.reply("❌ Wrong");
    await ctx.answerCallbackQuery();
  }

  //   const ans
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();

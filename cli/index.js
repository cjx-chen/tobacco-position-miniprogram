const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const templatePath = './cli/template';
const defaultFilePath = './src';
const fileType = ['.wxml', '.ts', '.json', '.less'];
const encoding = 'utf-8';
const init = () => {
  console.log(
    chalk.bold.green(
      figlet.textSync('MINIAPP CLI', {
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );
};

/**
 * questionList
 * @returns 
 */
const askQuestions = () => {
  const questions = [
    {
      type: 'list',
      name: 'Create',
      message: '请选择要创建的类型',
      choices: ['页面', '组件']
    },
    {
      type:'input',
      name: 'Path',
      message: '请输入要创建文件的路径'
    },
    {
      type: 'input',
      name: 'Input',
      message: '请输入文件名称'
    }
  ];
  return inquirer.prompt(questions);
};

const rsyncData = async (Type, Path, Input) => {
  // 默认取'./src'目录
  const filePath = Path || defaultFilePath
  fs.mkdir(`${filePath}/${Type}/${Input}`, (err) => {
    if (err) {
      console.log(chalk.red(`创建组件失败 --- ${filePath}/${Type}/${Input}组件已存在`));
      return;
    }
    console.log(chalk.green(`${filePath}/${Type}/${Input}文件夹创建成功`));
    fileType.map((item) => {
      fs.readFile(`${templatePath}/${Type}/${Type}${item}`, { encoding }, function (
        err,
        msg
      ) {
        fs.writeFile(
          `${filePath}/${Type}/${Input}/${Input}${item}`,
          msg,
          encoding,
          function (error) {
            if (error) {
              console.log(error);
              return false;
            }
            console.log(
              chalk.green(`${filePath}/${Type}/${Input}/${Input}${item}创建成功`)
            );
          }
        );
      });
    });
  });
};

const execScript = async () => {
  const exec = require('child_process').exec;
  const cmdStr = 'npm run dev';
  exec(cmdStr, (err, stdout, stderr) => {
    if (err) {
      console.warn(new Date(), ' 编译命令执行失败');
    } else {
      console.warn(new Date(), ' 编译命令执行成功');
    }
  });
}

const run = async () => {
  init();
  const answers = await askQuestions();
  const { Create, Path, Input } = answers;
  let Type;
  switch (Create) {
    case '页面':
      Type = 'pages';
      break;
    case '组件':
      Type = 'components';
      break;
  }
  await rsyncData(Type, Path, Input);
  // await execScript();
};

run();

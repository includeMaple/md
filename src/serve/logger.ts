import { LOGGER_CONFIGS } from './configs';
import { writeFile, access, appendFile } from 'fs/promises';

interface ILoggerItem {
  content: string,
  time: string,
  type: ILoggerType
}
type ILoggerType = 'success'|'fail'|'warning'|'log';

export class Logger {
  private logList: ILoggerItem[] = [];
  private isWrite = false;
  public configs = LOGGER_CONFIGS;

  private async add (item: ILoggerItem) {
    this.logList.unshift(item);
    !this.isWrite && this.write();
  }

  private async write () {
    this.isWrite = true;
    let doc = ''
    while (this.logList.length > 0) {
      let item: ILoggerItem | undefined= this.logList.pop();
      if (item) {
        doc += `[${item.type}] ${item.time} ${item.content}\n`;
      }
    }
    if (doc) {
      let filePath = `${this.configs.file}`;
      try {
        await access(filePath);       
      } catch (error) {
        await writeFile(filePath, doc);
        this.isWrite = false;
        return;
      }

      await appendFile(filePath, doc, 'utf-8')
      this.isWrite = false;
    }
  }

  log (content: string, type:ILoggerType = 'log') {
    this.add({
      content: content,
      time: this.getDate(),
      type: type
    })
  }

  getDate () {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
}

export let logger = new Logger();
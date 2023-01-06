import { LOGGER_CONFIGS } from './configs';
import { writeFile, access, appendFile } from 'fs/promises';
import { toolbox } from '../utils';

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
      time: toolbox.dataFormat(),
      type: type
    })
  }
}

export let logger = new Logger();
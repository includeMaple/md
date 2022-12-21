[book](title: github使用)
# github已有项目怎么修改
## 本地没有项目
如果本地没有项目，需要首先clone到本地
@@code git clone https://github.com/includeMaple/data-structure.git@@
已有项目可以跳过这一步
## 代码提交
相关操作有以下几种
@@code pull@@拉取远程提交内容并合并到当前工作区
@@code commit@@提交到本地仓库
@@code push@@通过对比 commit 的记录,如果本地高于远程就直接把多出来的commit 给怼上去,如果本地分支的最新版本和远程的 commit 有冲突，就需要解决冲突
所以正常开发流程是：
1、开发前pull获取最新版本
2、开发中有多次commit
3、push前再次pull更新一下本地代码，此时如果有冲突就需要解决冲突
4、push代码
### push
@@code $ git pull ## 拉取远程提交内容并合并到当前工作区@@
### git add
git add xx命令可以将xx文件添加到暂存区 
@@code git add -A@@表示添加所有内容
@@code git add . @@表示添加新文件和编辑过的文件不包括删除的文件
@@code git add -u@@ 表示添加编辑或者删除的文件，不包括新添加的文件
#### add的时候出现warning: LF will be replaced by CRLF in .eslintrc.js.
问题根源：不同操作系统所使用的换行符不一样。
三大主流操作系统的换行符：
Uinx/Linux采用换行符LF表示下一行（LF：LineFeed，中文意思是换行）；
Dos和Windows采用回车+换行CRLF表示下一行（CRLF：CarriageReturn LineFeed，中文意思是回车换行）；
Mac OS采用回车CR表示下一行（CR：CarriageReturn，中文意思是回车）。
在Git中，可以通过以下命令来显示当前你的Git中采取哪种对待换行符的方式（看见很多都说通过如下方式解决，然而我以为别的原因重启电脑在此add没有再出现这个warning）
$ git config core.autocrlf
此命令会有三个输出，“true”，“false”或者“input”
true，Git会将你add的所有文件视为文本，将结尾的CRLF转换为LF，而checkout时会再将文件的LF格式转为CRLF格式。
false，line endings不做任何改变，文本文件保持其原来的样子。
input，add时Git会把CRLF转换为LF，而check时仍旧为LF，所以Windows操作系统不建议设置此值。
### git commit -m "提交注释"

### git push origin  分支名称
一般使用：git push origin master

# 库操作
## 删库
%% 进入要删除的仓库%%右上角有一个settings，点击进入
%% Delete this repository%%页面拉到最后，找到Delete this repository，单击
%% 项目名称%%为了防止误删，这里需要手动输入项目名称验证
# 其他操作
## git 查看提交数据
@@code git show HEAD@@



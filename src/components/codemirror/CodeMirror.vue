<template>
  <div class="sql-editor">
    <!-- <div>123</div> -->
    <div class="sql-editor-code">
      <textarea ref="mycode" class="codesql" v-model="code"></textarea>
    </div>
  </div>
</template>
<script>
// import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import "./sql-hint.css";
import "codemirror/theme/base16-light.css";

let CodeMirror = require("codemirror/lib/codemirror");
// require("codemirror/addon/edit/matchbrackets");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/sql-hint");

export default {
  name: "codeMirror",
  // props: {
  //   sql: string
  // },
  data() {
    return {
      code: "select * from user",
    };
  },
  methods: {
    onKeyDown(event) {
      const keyCode = event.keyCode || event.which || event.charCode;
      const keyCombination = event.ctrlKey || event.altKey || event.metaKey;
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs.myCm.codemirror.showHint({ completeSingle: false });
      }
    },
  },
  mounted() {
    /**
     * api：https://codemirror.net/doc/manual.html#api
     */
    let mime = "text/x-pgsql"; // For PostgreSQL - https://www.postgresql.org/docs/11/sql-keywords-appendix.html
    //let theme = 'ambiance'//设置主题，不设置的会使用默认主题
    let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      value: "", //编辑器的起始值
      mode: mime, //选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
      // lineSeparator: string|null 显式设置编辑器的行分隔符。默认情况下（值null）
      //theme: theme,用编辑器设计样式的主题
      /**
       * 行缩进没试出来
       */
      // indentUnit: 2,//integer 一个块（编辑语言中的含义）应缩进多少个空格。默认值为2。
      // smartIndent: true,//boolean 是否使用模式提供的上下文相关缩进（或者只是缩进与之前的行相同）。默认为true。
      // tabSize: 4, // integer tab键的宽度。默认为4。
      indentWithTabs: true, //在缩进时，是否tabSize 应该用N个制表符替换前N *个空格。默认值为false。
      // specialChars: RegExp 用于确定哪些字符应由特殊占位符替换的正则表达式。
      // direction: “ltr” | "rtl" 翻转整体布局并选择基本段落方向为从左到右或从右到左。默认为“ltr”。
      // keyMap: string 配置要使用的键映射。默认值是"default"，
      // extraKeys: object 可用于为编辑器指定额外的键绑定，以及由其定义的绑定keyMap。
      // extend: bool 是否扩展现有选择范围或开始新选择范围。默认情况下，单击班次时会启用此功能。
      // addNew: bool启用后，这会为现有选择添加新范围，而不是替换它。默认行为是在Mac OS上为命令单击启用此功能，并在其他平台上按住Control键单击。
      // moveOnDrag: bool 当鼠标甚至拖动编辑器内部的内容时，它控制是复制（false）还是移动（true）。默认情况下，通过在Mac OS上单击鼠标右键并在其他位置按住Ctrl键单击来启用此功能。
      // lineWrapping: boolean CodeMirror是否应滚动或换行以排长行。默认为false（滚动）。
      lineNumbers: true, // 是否在编辑器左侧显示行号。
      // firstLineNumber: integer 在哪个数字开始计数行。默认值为1。
      // lineNumberFormatter: function(line: integer) → string  用于格式化行号的函数。该函数传递给行号，并应返回将在装订线中显示的字符串。
      // gutters: array < string> 可用于添加额外的排水沟（超出或代替行号排水沟）。
      // fixedGutter: boolean 确定装订线是否水平滚动内容（false）或在水平滚动期间是否保持固定（true，默认值）。
      // scrollbarStyle: string 选择滚动条实现。默认为"native"，
      // coverGutterNextToScrollbar: boolean 当fixedGutter 打开时，并且存在水平滚动条，默认情况下，此滚动条左侧将显示装订线。
      // inputStyle: string 选择CodeMirror处理输入和焦点的方式。核心库定义"textarea" 和"contenteditable"输入模式。在移动浏览器上，默认为"contenteditable"。在桌面浏览器上，默认为"textarea"。
      // readOnly: boolean|string 这会禁止用户编辑编辑器内容。如果"nocursor"给出特殊值（而不是简单true），则不允许对编辑器进行聚焦。
      // showCursorWhenSelecting: boolean 选择是否处于活动状态时是否应绘制光标。默认为false。
      // lineWiseCopyCut: boolean 启用时（默认情况下），在没有选择时执行复制或剪切将复制或剪切其上有游标的整行。
      // pasteLinesPerSelection: boolean 当从外部源（而不是编辑器本身）粘贴某些内容时，如果行数与选择的数量相匹配，则CodeMirror将默认为每个选择插入一行。您可以将其设置false为禁用该行为。
      // selectionsMayTouch: boolean 确定多个选择是在触摸时（默认值）还是仅在它们重叠时（true）连接。
      // undoDepth: integer 编辑器存储的最大撤消级别数。请注意，这包括选择更改事件。默认为200。
      // historyEventDelay: integer 键入或删除时将导致新历史事件开始的不活动时间（以毫秒为单位）。默认为1250。
      // tabindex: integer 要分配给编辑器的选项卡索引。如果没有给出，则不会分配选项卡索引。
      // autofocus: boolean 可用于使CodeMirror将焦点集中在初始化上。默认为关闭。
      // phrases: ?object 某些插件通过该phrase 方法运行用户可见的字符串（例如界面中的标签）以允许翻译。
      // dragDrop: boolean 控制是否启用拖放。默认开启。
      // allowDropFileTypes: array< string> 设置（默认为null）时，只能将类型在数组中的文件放入编辑器中。字符串应该是MIME类型，并将根据浏览器报告type 的File对象进行检查。
      // cursorBlinkRate: number 用于光标闪烁的半周期（以毫秒为单位）。默认闪烁率为530毫秒。通过将此值设置为零，可以禁用闪烁。负值完全隐藏光标。
      // cursorScrollMargin: number 当接近可滚动文档中可见视图的顶部或底部时，总是在光标上方和下方留出多少额外空间。默认值为0。
      // cursorHeight: number 确定光标的高度。默认值为1，表示它跨越线的整个高度。对于某些字体（以及某些品味）较小的高度（例如0.85），导致光标无法一直到达线的底部，看起来更好
      // resetSelectionOnContextMenu: boolean 控制当在当前选择之外单击打开上下文菜单时，是否将光标移动到单击点。默认为true。
      // workTime, workDelay: number 突出显示由伪背景线程完成，该线程将工作workTime毫秒，然后使用超时睡眠workDelay毫秒。默认值为200和300，您可以更改这些选项以突出显示或多或少的激进。
      // pollInterval: number 指示CodeMirror应该如何快速轮询其输入textarea以进行更改（聚焦时）。大多数输入都是由事件捕获的，但某些内容（如某些浏览器上的IME输入）不会生成允许CodeMirror正确检测它的事件。因此，它民意调查。默认值为100毫秒。
      // flattenSpans: boolean 默认情况下，如果相邻标记具有相同的类，则它们会将相邻标记合并为单个跨度。这将导致更简单的DOM树，从而表现更好。使用某些样式（例如圆角），这将改变文档的外观。您可以将此选项设置为false以禁用此行为。
      // addModeClass: boolean 启用时（默认情况下为off），将为每个标记添加一个额外的CSS类，指示生成它的（内部）模式，前缀为"cm-m-"。例如，来自XML模式的标记将获得cm-m-xml该类。
      // maxHighlightLength: number 当突出显示长行时，为了保持响应，编辑器将放弃并简单地将行的其余部分设置为纯文本，当它到达某个位置时。默认值为10 000.您可以将其设置Infinity为关闭此行为。
      // viewportMargin: integer 指定在当前滚动到视图中的文档部分上方和下方呈现的行数。这会影响滚动时所需的更新量以及此类更新所做的工作量。您通常应该将其保留为默认值10.
      matchBrackets: true,
      styleActiveLine: true, // 高亮选中行
      // autofocus: true,
      // extraKeys: { Ctrl: "autocomplete" }, //自定义快捷键
      hintOptions: {
        completeSingle: false, // 当匹配只有一项的时候是否自动补全
        //自定义提示选项
        // tables: {
        //   users: ["name", "score", "birthDate"],
        //   countries: ["name", "population", "size"],
        // },
      },
    });
    editor.on("keypress", (editor) => {
      editor.showHint();
    });
  },
};
</script>
<style>
.sql-editor {
  position: relative;
  z-index: 0;
  flex: 1 1 auto;
  height: 100%;
  display: flex;
  overflow: auto;
}

.sql-editor-code {
  flex: 1 1 auto;
  overflow: auto;
}

.CodeMirror {
  flex: 1 1 auto;
  height: 100%;
}

.codesql {
  text-align: left;
  font-size: 11pt;
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
}
</style>
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanttChart = void 0;
const react_1 = __importStar(require("react"));
const core_1 = require("@material-ui/core");
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Table_1 = __importDefault(require("@material-ui/core/Table"));
const TableBody_1 = __importDefault(require("@material-ui/core/TableBody"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const TableHead_1 = __importDefault(require("@material-ui/core/TableHead"));
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const Tooltip_1 = __importDefault(require("@material-ui/core/Tooltip"));
const ArrowForward_1 = __importDefault(require("@material-ui/icons/ArrowForward"));
const ArrowBack_1 = __importDefault(require("@material-ui/icons/ArrowBack"));
const dayjs_1 = __importDefault(require("dayjs"));
const use_resize_observer_1 = __importDefault(require("use-resize-observer"));
const useStyles = (0, core_1.makeStyles)({
    ganttLabel: {
        display: 'flex',
        padding: '16px',
        justifyContent: 'end',
        alignItems: 'center'
    },
    ganttLabelItem: {
        display: 'flex',
        padding: '0 0 0 0',
        justifyContent: 'end'
    },
    ganttLabelColor: {
        borderRadius: "50%",
        height: '16px',
        width: '16px',
        marginLeft: '32px',
        marginRight: '8px'
    },
    ganttLineDot: {
        borderRadius: "50%",
        height: '16px',
        width: '16px',
    },
    projectBlank: {
        backgroundColor: '#CBD5E1'
    },
    shade: {
        backgroundColor: '#F1F5F9'
    },
    tooltip: {
        backgroundColor: '#0F172A',
        color: 'white'
    },
    arrow: {
        "&:before": {
            backgroundColor: '#0F172A'
        }
    },
    ganttLine: {
        position: 'relative',
        height: '16px',
        borderRadius: '8px',
        padding: '0 0 0 0',
        top: '50%',
        transform: 'translate(0, -50%)'
    },
    rightArrowButtonWrapper: {
        position: 'absolute',
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        padding: '0 0 0 0',
        border: "none"
    },
    leftArrowButtonWrapper: {
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translate(0, -50%)',
        padding: '0 0 0 0',
        border: "none"
    },
    ganttLineWrapper: {
        position: 'absolute',
        height: '100%',
        top: 0,
        padding: '0 0 0 0',
        overflow: 'hidden',
        border: "none"
    },
    tableCellGantt: {
        whiteSpace: 'nowrap',
        border: '1px solid #E2E8F0',
        borderTop: "none",
        borderBottom: "none"
    },
    tableCellBorder: {
        whiteSpace: 'nowrap',
        border: '1px solid #E2E8F0'
    },
    tableCell: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '150px',
        border: '1px solid #E2E8F0',
        padding: '8px'
    },
    tableCellBorderBoldRight: {
        borderRight: '3px solid #E2E8F0'
    },
    tableCellBorderBoldLeft: {
        borderLeft: '3px solid #E2E8F0'
    },
    tableCellBorderBottom: {
        borderBottom: '1px solid #E2E8F0'
    },
    tableHead: {
        maxWidth: 125,
        minWidth: 125,
        padding: 0,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        textAlign: 'center'
    },
    tableRow: {
        height: 40,
        position: 'relative'
    },
    container: {
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: '500px',
        minHeight: '60%',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 50,
        padding: 10,
        margin: 10
    }
});
const GanttChart = (props) => {
    const { tasks, numOfMonthsDisplayed, cellsPerMonth, tableHeader } = props;
    const ganttOverflow = 20;
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const noop = (n) => n;
    const { ref: ref3, width: widthColumnMonth = 0 } = (0, use_resize_observer_1.default)({
        box: "border-box",
        round: noop
    });
    const refMaps = tasks[0].tableColumns.map((column) => {
        const { ref: ref, width: widthColumn = 0 } = (0, use_resize_observer_1.default)({
            box: "border-box",
            round: noop
        });
        return {
            ref,
            widthColumn
        };
    });
    const [monthOffset, setMonthOffset] = (0, react_1.useState)(0);
    const incrementMonthOffset = () => {
        setMonthOffset(monthOffset + 1);
    };
    const decrementMonthOffset = () => {
        setMonthOffset(monthOffset - 1);
    };
    const monthDiff = (a, b) => {
        // function from moment.js in order to keep the same result
        if (a.isBefore(b))
            return -monthDiff(b, a);
        const wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month());
        const anchor = a.clone().add(wholeMonthDiff, 'month');
        const c = b - anchor < 0;
        const anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), 'month');
        return +(-(wholeMonthDiff + ((b - anchor) / (c ? (anchor - anchor2) :
            (anchor2 - anchor)))) || 0);
    };
    const classes = useStyles();
    const monthLabels = [...Array(numOfMonthsDisplayed).keys()]
        .map(elt => months[(0, dayjs_1.default)().add(elt + monthOffset, 'month').month()]);
    const monthPixelSize = widthColumnMonth;
    const ganttTableSection = (tableData) => {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(TableHead_1.default, { className: classes.tableHead },
                react_1.default.createElement(TableRow_1.default, { className: classes.tableRow },
                    react_1.default.createElement(TableCell_1.default, { className: [classes.tableCellBorder, classes.shade].join(" "), colSpan: 2 + cellsPerMonth * numOfMonthsDisplayed },
                        react_1.default.createElement("b", null, tableHeader)))),
            react_1.default.createElement(TableBody_1.default, null, tableData === null || tableData === void 0 ? void 0 : tableData.map((row, index) => {
                const { startDate, endDate, tooltip, tableColumns, color } = row;
                const tableCellStyle = index === tableData.length - 1 ? [classes.tableCellGantt, classes.tableCellBorderBottom].join(" ") : classes.tableCellGantt;
                const ganttLineStartCalc = monthDiff((0, dayjs_1.default)(startDate || '2000-01-01'), (0, dayjs_1.default)().startOf("month").add(monthOffset, "month")) * monthPixelSize;
                const ganttLineSizeCalc = monthDiff((0, dayjs_1.default)(endDate || '3000-01-01').add(1, 'day'), (0, dayjs_1.default)(startDate || '2000-01-01')) * monthPixelSize;
                const overflowStart = ganttLineStartCalc < -1 * ganttOverflow ? (ganttLineStartCalc + ganttOverflow) * -1 : 0;
                const overflowEnd = ganttLineStartCalc + ganttLineSizeCalc > monthPixelSize * numOfMonthsDisplayed + ganttOverflow ? ganttLineStartCalc + ganttLineSizeCalc - monthPixelSize * numOfMonthsDisplayed - ganttOverflow : 0;
                const ganttLineStart = overflowStart === 0 ? ganttLineStartCalc : -1 * ganttOverflow;
                const ganttLineSize = Math.max(0, ganttLineSizeCalc - overflowStart - overflowEnd);
                const ganttColor = (0, core_1.makeStyles)({
                    lineColor: {
                        backgroundColor: color
                    }
                });
                const ganttClass = ganttColor();
                let ganttLineStyle = [classes.ganttLine, ganttClass.lineColor].join(" ");
                if (!startDate || !endDate) {
                    ganttLineStyle = [classes.ganttLine, classes.projectBlank].join(" ");
                }
                return (react_1.default.createElement(TableRow_1.default, { key: index, className: classes.tableRow },
                    tableColumns.map((column, columnIndex) => {
                        return (react_1.default.createElement(TableCell_1.default, { ref: index === 0 ? refMaps[columnIndex].ref : undefined, className: classes.tableCell }, column));
                    }),
                    monthLabels.map((month) => {
                        return ([...Array(cellsPerMonth).keys()].map(cellIndex => {
                            const classNames = [tableCellStyle];
                            if (cellIndex === 0) {
                                classNames.push(classes.tableCellBorderBoldLeft);
                            }
                            if (cellsPerMonth === cellIndex + 1) {
                                classNames.push(classes.tableCellBorderBoldRight);
                            }
                            return (react_1.default.createElement(TableCell_1.default, { key: `${month}${cellIndex}`, className: classNames.join(" ") }));
                        }));
                    }),
                    react_1.default.createElement(TableCell_1.default, { colSpan: 0, className: classes.ganttLineWrapper, style: { left: refMaps.reduce((acc, object) => {
                                return acc + object.widthColumn;
                            }, 0), width: monthPixelSize * numOfMonthsDisplayed } },
                        react_1.default.createElement(Tooltip_1.default, { title: react_1.default.createElement(react_1.default.Fragment, null, tooltip), arrow: true, placement: "top", classes: { arrow: classes.arrow, tooltip: classes.tooltip } },
                            react_1.default.createElement("div", { className: ganttLineStyle, style: { left: ganttLineStart, width: ganttLineSize } }, (!startDate || !endDate) && react_1.default.createElement("div", { className: [classes.ganttLineDot, ganttClass.lineColor].join(" ") }))))));
            }))));
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Paper_1.default, { className: classes.container },
            react_1.default.createElement(Table_1.default, null,
                react_1.default.createElement(TableHead_1.default, { className: classes.tableHead },
                    react_1.default.createElement(TableRow_1.default, { className: classes.tableRow },
                        react_1.default.createElement(TableCell_1.default, { colSpan: 2 }),
                        monthLabels.map((month, index) => {
                            return (react_1.default.createElement(TableCell_1.default, { ref: index === 0 ? ref3 : undefined, key: month, colSpan: cellsPerMonth, align: "center" },
                                react_1.default.createElement("b", null, month)));
                        }),
                        monthOffset > 0 && react_1.default.createElement(TableCell_1.default, { colSpan: 0, className: classes.leftArrowButtonWrapper, style: { left: refMaps.reduce((acc, object) => {
                                    return acc + object.widthColumn;
                                }, 0) } },
                            react_1.default.createElement(core_1.IconButton, { size: "small", onClick: decrementMonthOffset },
                                react_1.default.createElement(ArrowBack_1.default, { fontSize: "small" }))),
                        monthOffset < 9 && react_1.default.createElement(TableCell_1.default, { colSpan: 0, className: classes.rightArrowButtonWrapper },
                            react_1.default.createElement(core_1.IconButton, { size: "small", onClick: incrementMonthOffset },
                                react_1.default.createElement(ArrowForward_1.default, { fontSize: "small" }))))),
                ganttTableSection(tasks)))));
};
exports.GanttChart = GanttChart;

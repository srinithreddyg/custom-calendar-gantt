import React, { useState } from 'react'
import { IconButton, makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import dayjs from 'dayjs'
import useResizeObserver from "use-resize-observer";

const useStyles = makeStyles({
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
    overflowY:'auto',
    maxHeight: '500px',
    minHeight:'60%',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 50,
    padding: 10,
    margin: 10
  }
})
export type field = {
  name: string,
  value: any
}
export type Task = {
  startDate: string,
  endDate: string,
  tooltip: any,
  color: string,
  tableColumns: string[]
}
type props = {
  tasks: Task[],
  numOfMonthsDisplayed: number,
  cellsPerMonth: number,
  tableHeader: string
}

export const GanttChart = (props: props) => {
  const { tasks, numOfMonthsDisplayed, cellsPerMonth, tableHeader } = props
  const ganttOverflow = 20

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  const noop = (n: any) => n;
  const { ref: ref3, width: widthColumnMonth = 0 } = useResizeObserver<HTMLDivElement>({
    box: "border-box",
    round: noop
  });

  const refMaps = tasks[0].tableColumns.map((column) => {
    const { ref: ref, width: widthColumn = 0 } = useResizeObserver<HTMLDivElement>({
      box: "border-box",
      round: noop
    });
    return {
      ref,
      widthColumn
    }
  })

  const [monthOffset, setMonthOffset] = useState(0);

  const incrementMonthOffset = () => {
    setMonthOffset(monthOffset+1)
  }
  const decrementMonthOffset = () => {
    setMonthOffset(monthOffset-1)
  }

  const monthDiff: any = (a: any, b: any) => {
    // function from moment.js in order to keep the same result
    if (a.isBefore(b)) return -monthDiff(b, a)
    const wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month())
    const anchor = a.clone().add(wholeMonthDiff, 'month')
    const c = b - anchor < 0
    const anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), 'month')
    return +(-(wholeMonthDiff + ((b - anchor) / (c ? (anchor - anchor2) :
      (anchor2 - anchor)))) || 0)
  }

  const classes = useStyles()
 
  const monthLabels = [...Array(numOfMonthsDisplayed).keys()]
    .map(elt => months[dayjs().add(elt+monthOffset, 'month').month()])

  const monthPixelSize = widthColumnMonth

  const ganttTableSection = (tableData: Task[]) => {
    return (
      <>
        <TableHead className={classes.tableHead}>
          <TableRow className={classes.tableRow}>
            <TableCell className={[classes.tableCellBorder, classes.shade].join(" ")} colSpan={2 + cellsPerMonth * numOfMonthsDisplayed}>
              <b>{tableHeader}</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.map((row, index) => {
            const {
              startDate,
              endDate,
              tooltip,
              tableColumns,
              color
            } = row
            const tableCellStyle = index === tableData.length - 1 ? [classes.tableCellGantt, classes.tableCellBorderBottom].join(" ") : classes.tableCellGantt
            const ganttLineStartCalc = monthDiff(dayjs(startDate || '2000-01-01'),dayjs().startOf("month").add(monthOffset, "month")) * monthPixelSize
            const ganttLineSizeCalc = monthDiff(dayjs(endDate || '3000-01-01').add(1, 'day'),dayjs(startDate || '2000-01-01')) * monthPixelSize
            const overflowStart = ganttLineStartCalc < -1 * ganttOverflow ? (ganttLineStartCalc + ganttOverflow) * -1 : 0
            const overflowEnd = ganttLineStartCalc + ganttLineSizeCalc > monthPixelSize*numOfMonthsDisplayed+ganttOverflow ? ganttLineStartCalc + ganttLineSizeCalc - monthPixelSize*numOfMonthsDisplayed - ganttOverflow : 0 
            const ganttLineStart = overflowStart === 0 ? ganttLineStartCalc : -1 * ganttOverflow
            const ganttLineSize = Math.max(0, ganttLineSizeCalc - overflowStart - overflowEnd)

            const ganttColor = makeStyles({
              lineColor: {
                backgroundColor: color
              }
            })
            const ganttClass = ganttColor()
            
            let ganttLineStyle = [classes.ganttLine, ganttClass.lineColor].join(" ")
            if(!startDate || !endDate){
              ganttLineStyle = [classes.ganttLine, classes.projectBlank].join(" ")
            }
            
            return (
              <TableRow key={index} className={classes.tableRow}>
                {tableColumns.map((column, columnIndex) => {
                  return(
                    <TableCell ref={index === 0 ? refMaps[columnIndex].ref : undefined} className={classes.tableCell}>{column}</TableCell>
                  )
                })}
                {monthLabels.map((month) => {
                  return (
                    [...Array(cellsPerMonth).keys()].map(cellIndex => {
                      const classNames = [tableCellStyle]
                      if(cellIndex === 0){
                        classNames.push(classes.tableCellBorderBoldLeft)
                      }
                      if(cellsPerMonth === cellIndex + 1){
                        classNames.push(classes.tableCellBorderBoldRight)
                      }
                      return (
                        <TableCell key={`${month}${cellIndex}`} className={classNames.join(" ")}></TableCell>
                      )
                    })
                  )
                })}
                <TableCell 
                  colSpan={0} 
                  className={classes.ganttLineWrapper} 
                  style={{left: refMaps.reduce((acc, object) => {
                    return acc + object.widthColumn;
                  }, 0), width: monthPixelSize * numOfMonthsDisplayed}}
                >
                  <Tooltip 
                    title={
                      <React.Fragment>
                        {tooltip}
                      </React.Fragment>
                    }
                    arrow  
                    placement="top"
                    classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
                  >
                    <div
                      className={ganttLineStyle} 
                      style={{left: ganttLineStart, width: ganttLineSize}}
                    >
                      {(!startDate || !endDate) && <div
                        className={[classes.ganttLineDot, ganttClass.lineColor].join(" ")}
                      ></div>}
                    </div>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </>
    )
  }

  return (
    <>
      <Paper className={classes.container}>
        <Table>
          <TableHead className={classes.tableHead}>
            
            <TableRow className={classes.tableRow}>
              <TableCell colSpan={2}>
              </TableCell>
              {monthLabels.map((month, index) => {
                return (
                  <TableCell ref={index === 0 ? ref3 : undefined} key={month} colSpan={cellsPerMonth} align="center">
                    <b>{month}</b>
                  </TableCell>
                )
              })}
              {monthOffset > 0 && <TableCell colSpan={0} className={classes.leftArrowButtonWrapper} style={{left: refMaps.reduce((acc, object) => {
                    return acc + object.widthColumn;
                  }, 0)}}>
                <IconButton size="small" onClick={decrementMonthOffset}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              </TableCell>}
              {monthOffset < 9 && <TableCell colSpan={0} className={classes.rightArrowButtonWrapper}>
                <IconButton size="small" onClick={incrementMonthOffset}>
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </TableCell>}
            </TableRow>
          </TableHead>
          {ganttTableSection(tasks)}
        </Table>
      </Paper>
    </>
  )
}

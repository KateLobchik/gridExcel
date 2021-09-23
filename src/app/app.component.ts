import { convertUpdateArguments } from "@angular/compiler/src/compiler_util/expression_converter";
import { Component, ViewChild, ElementRef, Input } from "@angular/core";
import * as jspreadsheet from "jspreadsheet-ce";
import { Valdata } from "./valdata";
import { VALDATAS } from "./valdataS";
import { ChartView, ECharts, EChartsOption } from 'echarts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  _chattsOptions: EChartsOption = {};

  data = VALDATAS;
  dataNames: any[] = [];
  dataValues: any[] = [];
  aliasName!: string;
  aliasVal!: string;


  @ViewChild("spreadsheet")
  spreadsheet!: ElementRef;

  chart() {
    this.dataNames = [];
    this.dataValues = [];

    this.aliasName = "day";
    this.aliasVal = "count";
    function getByAlias(item: any, alias: any) {
      for (const val of item.info) {
        if (val.field != alias) {
          continue;
        }
        return val.value;
      }
      return null;
    }
    for (const item of this.data) {
      const dataName = getByAlias(item, this.aliasName);
      const dataVal = getByAlias(item, this.aliasVal);
      this.dataNames.push(dataName)
      this.dataValues.push({ name: dataName, value: dataVal });
    }

    this._chattsOptions = {
      tooltip: {},
      xAxis: { data: this.dataNames, type: 'category' },
      yAxis: { type: 'value', scale: true },
      series: [{
        type: 'line',
        data: this.dataValues,
        smooth: true,
      }]
    };
  }


  update(instance: any, cell: any, x: any, y: any, value: any) {
    VALDATAS[y].info[x].value = value;
    this.chart();
    //Скорее всего здесь нужна функция, которая будет вызывать повторную прорисовку графика
  }

  ngOnInit(): void {
    this.update = this.update.bind(this);
    this.chart();
  }


  ngAfterViewInit() {

    jspreadsheet(this.spreadsheet.nativeElement, {
      data: this.dataValues,
      columns: [
        {
          title: this.aliasName, width: 130
        },
        {
          title: this.aliasVal, width: 130
        }
      ],
      onchange: this.update
    });

  }

}

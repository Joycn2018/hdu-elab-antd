///<reference path="../../../../node_modules/@angular/forms/src/model.d.ts"/>
///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {YyglService} from './yygl.service';
import {Router} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {UserService} from '../user/user.service';
import {SessionStorageService} from '@core/storage/storage.module';
import {consoleTestResultHandler} from 'tslint/lib/test';

@Component({
  selector: 'Yygl',
  templateUrl: 'yygl.component.html',
  styleUrls: ['./yygl.component.less'],
  providers: [YyglService]
})

export class YyglComponent implements OnInit {
    _value = ''; /*搜索内容*/
    choice = 100; /*筛选条件:全部：100 进行中：0 未开始：0*/
    userName = '40392';
    orderDetails = [];
    UnfinishOrder = [];
    orders = [];
    /*接口地址*/
    apiUrl = [
        'http://aliyun.charlesxu.cn:8080/LabManager/order/getOrderByUsername', /*0获取预约*/
        'http://aliyun.charlesxu.cn:8080/LabManager/order/getFinishedSimpleOrderListByUsername', /*1获取通过预约*/
        'http://aliyun.charlesxu.cn:8080/LabManager/order/getUnfinishedSimpleOrderListByUsername', /*2获取未通过预约*/
    ];
    constructor(private yyglService: YyglService, private confirmServ: NzMessageService, private  router: Router,
               private _storage: SessionStorageService) {
    }
    // 换星期几
    private getDayByNum(num: number) {
        const array = ['天', '一', '二', '三', '四', '五', '六', '天'];
        return array[num];
    }
    // 获得全部学时
    private getAllHour(orders: any) {
        let hour = 0;
        for (let i of orders) {
            for (let j of i.orderDetails) {
                hour += j.classNum.length  * j.orderWeek.length;
            }
        }
        return hour;
    }
    // 获得课程学时
    private getHour(order: any) {
        let hour = 0;
        for (let i of order) {
                hour += i.classNum.length * i.orderWeek.length;
        }
        return hour;
    }
    private goToDetail(data: any) {
        console.log(data.id);
        this.router.navigate(['/orders/detail/?id=', data.id]);
    }
    private boolArranged(pass: any) {
        if (pass === '未安排') {
            return true;
        } else if (pass === '安排失败') {
            return true;
        } else {
            return false;
        }
    }
    private _getData = () => {
        // 获取预约
        this.yyglService.getOrders(this.apiUrl[0], this.userName)
            .then((result: any) => {
                const data = JSON.parse(result['_body'])['Order'];
                for (let i of data) {
                    i.expand = false;
                }
                this.orders = data;
            });
        // 获取通过预约
       /* this.yyglService.getOrders(this.apiUrl[1], this.userName)
            .then((result: any) => {
                this.finishOrder = JSON.parse(result['_body'])['SimpleOrder'];
            });*/
        // 获取未通过预约
        this.yyglService.getOrders(this.apiUrl[2], this.userName)
            .then((result: any) => {
                this.UnfinishOrder = JSON.parse(result['_body'])['SimpleOrder'];
            });
    }
    private boolOpen(expand: boolean) {
        if (expand) {
            this.yyglService.getLab()
                .then((result: any) => {
                    const { data } = result;
                    this.orderDetails = data;
                });
        }
        return expand;
    }
    onSearch(event: string): void {
        console.log(event);
    }
    ngOnInit(): void {
        this._getData();
    }
}


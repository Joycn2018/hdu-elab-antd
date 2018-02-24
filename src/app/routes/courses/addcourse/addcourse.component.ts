///<reference path="../../../../../node_modules/@angular/forms/src/model.d.ts"/>
///<reference path="../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AddcourseService} from './addcourse.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.service';


@Component({
    selector: 'addcourse',
    templateUrl: 'addcourse.component.html',
    styleUrls: ['./addcourse.component.less'],
    providers: [AddcourseService]
})
export class AddcourseComponent implements OnInit {
    validateForm: FormGroup;
    loadStatus: boolean;
    submitBtn = '提交';
    curl = 'http://aliyun.charlesxu.cn:8080/LabManager/class/addclass';
    constructor(private _storage: SessionStorageService, private fb: FormBuilder,
                private addcourseService: AddcourseService, private confirmServ: NzModalService) {
    }
    week = [{ value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
        { value: 7, label: '7' },
        { value: 8, label: '8' },
        { value: 9, label: '9' },
        { value: 10, label: '10' },
        { value: 11, label: '11' },
        { value: 12, label: '12' },
        { value: 13, label: '13' },
        { value: 14, label: '14' },
        { value: 15, label: '15' },
        { value: 16, label: '16' },
        { value: 17, label: '17' },
        { value: 18, label: '18' },
        { value: 19, label: '19' },
        { value: 20, label: '20' },
    ];
    weekday = [{ value: 1, label: '星期一' },
        { value: 2, label: '星期二' },
        { value: 3, label: '星期三' },
        { value: 4, label: '星期四' },
        { value: 5, label: '星期五' },
        { value: 6, label: '星期六' },
        { value: 7, label: '星期日' }
    ];
    classNum = [{ value: 1, label: '第1节' },
        { value: 2, label: '第2节' },
        { value: 3, label: '第3节' },
        { value: 4, label: '第4节' },
        { value: 5, label: '第5节' },
        { value: 6, label: '第6节' },
        { value: 7, label: '第7节' },
        { value: 8, label: '第8节' },
        { value: 9, label: '第9节' },
        { value: 10, label: '第10节' },
        { value: 11, label: '第11节' },
        { value: 12, label: '第12节' },
    ];
    /*//控制全选单双重置*/
    setWeek = (target, operation) => {
        this.validateForm.controls[target].reset();
        if (operation == 0) {
            let c = this.validateForm.value;
            c.week = this.week;
            this.validateForm.setValue(c);
        }
        if(operation==1){
            let c = this.validateForm.value;
            c.week = [];
            for(let i=0;i< this.week.length;i++){
                if(i%2==0){
                    c.week.push(this.week[i]);
                }
            }
            this.validateForm.setValue(c);
        }
        if(operation==2){
            let c = this.validateForm.value;
            c.week = [];
            for(let i=0;i< this.week.length;i++){
                if(i%2){
                    c.week.push(this.week[i]);
                }
            }
            this.validateForm.setValue(c);
        }
    };
    //控制全选单双重置

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    info(title, contentTpl) {
        this.confirmServ.info({
            title: title,
            content: contentTpl
        });
    }
    success = () => {
        const modal = this.confirmServ.success({
            title: '添加成功',
            content: '1秒后回到课程管理'
        });
        setTimeout(function () {
            modal.destroy();
            window.location.assign('/courses');
        }, 1000);

    }
    _submitForm() {
        let classId = '', className = '', weektemp = [], weekdaytemp = [], classNumtemp = [], classPeoCount = '';
        for (let j = 0; j < this.validateForm.controls['week'].value.length; j++) {
            weektemp.push(this.validateForm.controls['week'].value[j].value);
        }
        for (let j = 0; j < this.validateForm.controls['classNum'].value.length; j++) {
            classNumtemp.push(this.validateForm.controls['classNum'].value[j].value);
        }
        weekdaytemp[0] = this.validateForm.controls['weekday'].value.value;
        className = this.validateForm.controls['className'].value.value;
        let data = {
            classId: classId,
            className: className,//课程
            week: weektemp,//周数
            weekday: weekdaytemp,//星期几
            classNum: classNumtemp,//第几节
            classPeoCount: classPeoCount
        };
        this.addcourseService.executeHttp(this.curl, {username: this._storage.get('username'), data: data})
            .then((result: any) => {
                let res = JSON.parse(result['_body']);
                if (res['result'] !== 'success') {
                    this.info('警告', '提交失败,请检查网络连接后重试！');
                    return;
                } else {
                    this.success();
                }
            });
    }
    ngOnInit() {
        this.validateForm = this.fb.group({
            classId: [null, [Validators.required]],
            className: [null, [Validators.required]],
            week: [null, [Validators.required]],
            weekday: [null, [Validators.required]],
            classNum: [null, [Validators.required]],
            classPeoCount: [null, [Validators.required]],
        });
    }
}

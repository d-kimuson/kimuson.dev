---
title: "Prisma でメソッドはやせない問題どうしたらいいんだ"
description: "Prisma でどうにかメソッド生やせないか試す"
category: "TypeScript"
tags:
  - TypeScript
date: "2022-03-27T21:39:10Z"
thumbnail: "thumbnails/TypeScript.png"
draft: false
---

型安全にクエリ発行できて便利な [Prisma](https://www.prisma.io/) だけど、Prisma Client の戻り値がプレーンオブジェクトであるためメソッドを生やせないつらみがある

例えば適当なサービスのユーザーのドメインモデルがあるとして

```ts
class UserModel {
  id: number;
  firstName: string,
  lastName: string,

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

の fullName 実装が Prisma だと書けないよね〜という話

僕はサーバーサイドは NestJS で書くことが多くて、だいたい `user.service.ts` に `getUserFullName(user: User): string` とかを生やすことになる or 使いたい箇所で愚直に書くになるのでつらい

## ざっくり 2 方針

[Explore how to extend the Prisma Client · Issue #7161 · prisma/prisma · GitHub](https://github.com/prisma/prisma/issues/7161)

この辺りの Issue で議論されてるけど、すぐに Prisma 側でなにかをサポートする形にはならなそうなのでこちら側でなんとかしたみ

とりえあず 2 方針うかぶのでやってみる

- クラスにマッピングする
- 後付けでオブジェクトにメソッドを生やす

## クラスにマッピングする

拾ってきたデータをクラスにマッピングしてあげる

```ts:user.model.ts
import type { User } from '@prisma/client'

class UserModel<Data extends User> implements User {
  id: number;
  firstName: string;
  lastName: string;
  friendId: number | null;

  private data: Data;

  constructor(data: Data) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.friendId = user.friendId;
    this.data = data;
  }

  fullName() {
    return `${this.firstName} ${this.fullName}`;
  }
}
```

こんな感じでクラスにマッピングすればメソッド生やせる

ただやっぱりクラスだと柔軟性がワンランク落ちてしまうというのはあって、例えば Prisma だと例えば `A JOIN B` で拾ってきたら `A & { b: B }` で型解決される（データも拾ってこられる）けど、クラスでこれを表現しようと思ったら使用するリレーションのパターン分モデル作る(AModel, AWithBModel, ...etc)しかないのでなんともなーという感じ

上の例だと一応 data にデータおいてて型も残してるので参照自体はできるけど、リレーション先に依存したメソッドははやせない(`hoge() { this.relationProp でなにか }` ができない)

あと Prisma だとスキーマを [schema.prisma に書いていく](https://www.prisma.io/docs/concepts/components/prisma-schema) ので重複で同じくスキーマみたいなものをクラスで書くのは冗長な気もかなりする

## オブジェクトに生やす

JS のオブジェクトはメソッドはやせるから

```js
const user = {}
user.method = () => {
  console.log("Hi")
}
```

型解決できるならこれでも良いはず

→ [Vue とか config 系でよく使われる defineXXX のパターンで型解決はできる](https://www.typescriptlang.org/ja/play?#code/PTAEjkbQKV0aPVG+GQi1MA6mhABkL9xgRBkJcMgShkGsMnArhkAsGQdQZAzBkHAlQKIZAvxXMDt-QeQYjB7IPUGkGQIIYBYAKABcAngAcApqAAiogGYBLAHaiAsqP4ALAPYATAM4BJef1EAneQEMANgB4AQmZ2iA8gCMAVqFEAPI-N2gASqIAxhrGWlY6-MYKAOYANKAArvIA1vIaAO7yAHzZoAC8oFYq6to6Ht6ivuWBIWERUbEJyWmZOQWgAN4AvtkAFAC2qpq6AFygJSPlAGSgACpqsjpzIqK29k5uoLOTZdkAlAV5u36zC0srYusOLu47w3t80slB-LIa8qBaMgrKD7rXTbuLw+Py1ULhSLReTxJKpdJZXJ9Q6dPigUAheSRL4-RQnAxGUyWcZSOR4-76QwmczWOw3Nx5QqDCmHfJ5VG8dHo4yqRKmUBDUq6NGgboinn8Pmfb5kv5CgnUyx8MW8PhCMSgADqsnUEg0AzMChOVgACtEdAalNpRBYEnqDUb-oyilbvhYAKKeYRmXyiLQVUHlM1LS3W22gACCWi0OveNO16hOSjMwgDVT8HPRAG0ANKgBSgT1BCyJb5WFKiQQaaQTMOe72+rQJCtVmvBi1mV027IAXQA-OME2p7Yb5Maux6vT7vlpcz3mvC2tllf0tGZ+GZxhP69O-QkzNHYx9LEOkymB5HD29jxZT-9k8JWXkR46hdtQH0RZ1QLn858W9WtZujujb9uMPqCKKabVKA6qiIBB4xte8Y6moZ7CCK6J9kBNogTOmGgOMjgDDqxR1lOjbNpWgFRkhcYnqh6F5LMmZctmeYFgBNa0UeKGJveKY9uMPHIQx-FCg+c7QX4fQAHTyWYxgxDo4HyIIT6gBBBFsdhgSSqYlxrCJ9G3oxAnCHOy6cmxXLjIoABuJgESq+wANx8E8LzIRiPLrqIQ4vmO-ymuaoZutJNTBBCDTQrCLQIjkdr6qOJygMAABUoCAGxKgAgvoAJgyAIoMgDJDIAdgyAIYMgDhDOgJBFYAlgzoKA6XAP0gojCSyWviMKIiiAoAAAL8DoAC0XhiK8I3GMYoSEcIxhmIIowipi2IDGGd5CoOqGBca7ZhTaSUOkFQrOn0a4bvuV4metIwPhprHost-ACmtW0dZ8hT3Vy8myWdZhxNpoDfa12jOR51norINZ9IhvFiWh5mgAAhPkhTJDKvxaN14Ncr1ACMgCt1oAcWkEIANwyAD8MgDtDIA5wyAM8MgASiiVgBVDLggAdDIA5QyAPUMgATDIA1gyAIcMgC9DIAwwyAJMMgD2DIAIQzkIAQgyAEoMgDRDADvXQIAx5GAF42gAyDIAx2kkOgJWAOYMgAqDIAfgzsCQgBWDBrgCRDADtzBPwsktjo0OXTe13aLdsnSKE7pmEEah9H0LZ3QDD0fNiPIxEshLu-6hQw6JpniTdKZZi2mnlFxsGrAhrt8fDEmCRnoAAGJeXGocYuHT0thGyyrFoJehBOHTp-YoBZ30cGAb977bf8+yV6tboBW9aeVnXhmN83YY9h0kfRyYseDC9upj7X9diNPxgTj2g-Y+i3T72xKoERKUrPSPr2HSKp-Wef-LDzasfKmDvWzSGZgYhYshVE9+uAHxXQACEaAFUGQAMQzy2gGqVYoAACqDhjAdFYrILQdlEgDGcCYf61k5DGEiAAOTMEMcYUImgigsPYfghDiGgFITCbB6JpDRHTHoVBoB5DoMwYggAPuwxIFgLBpTAGyOBCDZIoOVO5VUvBeoo0KIAU7lADQcoAIoZADrDAQQAjQyU1poAZoYyYi1APg0QkQABSABlUA+tAD+8oAMQZsB8zJizAoKM35gESGIp+FhZKDQ-IAVYZACFDNgQA1wyAF8VQAsCpi3NkVfWnB0DoH3o9JICCTjlEKOjckQodBWHgSYfo+w+isV6oAHYjAAx2mLMqgBghiKkQQAnUqMANsgQAnQxcxJo082jBACHRoAVn1Bai0AEkMgAs7UAJX++tACyDIrHB-CLDUNEMiLoZ9eT8nUEsL2sg8FUKIeIAA1KAAA5Hs0AOzlk6FkhQghmzb4MNABodQJgThzM+scr2UyZlzKEaAQApEolRFnzbANNekixiarNWYyJmH2VPvPgGUKjCFCE9Jq2cNQ5J3v8Do3cazuLuRSKFmVRpwsamARJGRULItSoUIIvkjCj0OsaZFCRSVOj6JilFmTIUyLcWIhB9lZBBFEN4nQfBEnMokOuTcoiTBIJFCg8YuMrm4POTQgARBuKaiqrlnI2UqwQRCDxmDVSKJhv9fCsPGAAJgAAySPRO-UKZhZLMtWb4WB8hZAAEdEjiCIOwfWgA-o0AMYMZBRmAH0GQAzwYDLBkKhBHRiXqAZUKJlCCRUbkOO8mNahQAAsAAYMBVABYCYATQZcaABkIjWgBR-UAIGRgrw4aAsHyiwGgYgJqwUkkwzyBGvP2CmnGYBAC6DGA+RgBZNLFj8v5AKNZWMgKCytWInrMtST+YVormiJtFT2WSBphCB0xkcUAaa40jFOh295gBwSMQIAdeUCqADXleW5srYChTKAPNEyoVgB5BQ7yGtpbyyIKMj8HNAAVDAQfWf5iylnEIAcGMBmPoSdXZtxghwl2Yb4JNX8Poim+gu86BrENsIw2YV+vBI1L1Qgho1WhcbRpJck-4ja4PEew8h6DWJq21vrTR+D2HZWwfY6R3GrbpmbOREuoj6gSPpl44a9MhxeqAHlVQAMhnm3QM+quTGa2nNY8y7jYmvbYb4+2qTYBSbaPpt835-zhYiz6YAHxVABuDGLMZCnXGgFfeuOMoAP3y0OaAAmhNAB7DELQAKww00AA0MH400AA0IupXYFbbpoLAARDDYnmUGp3Yg03R0jpqKOxqo-GtLIn6OLvmTg7D4xd05ZGAkXqEnfCgCIOgGxgBahjJiVQAlgmQBIEGhqaaM3mb6YAQjs80QpS8xtTDaRR5bUKJ3wpqrkTam1oU1umBP7FmwgzT03tOkaW0MQT1qwCAGUGMB+tLOAE8GeWCWeY9Q5cJyb2HFvVa0Jt9M23Zn6dAHZ0ZCm+i7Ie093w+yvX6wg-FxLj7kBi0APnagBRiLFoAQh9AAaypmkgyBoCcEAIsMgAuhiCZwDWRVAAODGAvHNBACm5gp-bRBInoEAOg2Ytku8DZb1Zz77P2eZPUTEqEs8qcEAFiGgAXtx5hLQncXGAKf1nm9ggBbBhSzOxNohRDCGQ5K6y6Hl2YeK6R8Yn0VcmGQ1cxhJXYPIdvvhwjxgpDy6y2oPd2gaPm4V6Kxj2IHuW+t1oW3cvhB-cew9-ev3nhtuW+8xpPmyZc31pTgqtVkCAFmGZpgBH20YGQTgvPAClxju1CEWwupUAJfK7BADaDITwAAHKAB39aHH35YG27ft42+tAAPalbc23abGObka3tv7eO+d6753vgQA)

アプリケーションコードでは ↓ の感じで実装できる

```ts:user.methods.ts
import type { User } from '@prisma/client'
import { defineMethods } from 'path/to/prisma-util'

const userMethods = defineMethods<User>()({
  // 補完はちゃんと効くので、ストレスなく拡張メソッドを定義できる
  fullName() {
    return this.firstName + ' ' + this.lastName
  },
  otherMethod() {
    this.fullName()  // 別のドメインメソッドでも型解決できる
  }
})

export const withUserMethods = createWithDomainMethod<User, UserMethod>(userMethods)
export type UserMethods = typeof userMethods
export type UserModel = ReturnType<typeof withUserMethods>
```

```ts:user.service.ts
import { Injectable } from "@nestjs/common"
import { PrismaService } from "~/path/to/prisma.service"
import { UserModel, withUserMethods } from './user.methods.ts'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async fetchUser(): Promise<UserModel | undefined> {
    const userData = await this.prisma.user.findUnique({ where: { id: 'id' } });
    if (userData === null) return;

    const user = withUserMethods(userData);
    user.fullName();  // 生やしたメソッドが型安全に使える
    return user;
  }
}
```

上のプレイグラウンドに書いたけど、こっちのやり方ならリレーション先にもメソッドを生やす ＆ 型解決したりができる

```ts
const userWithFriend = withUserMethods(userWithFriendData, {
  friend: withUserMethod,
})
```

ので、クラスベースじゃないから Prisma が解決してくれる柔軟な型定義とデータ構造を生かしやすいのはこっちかなという気がする

## 比較する

- スキーマの再定義の必要もない
- リレーション先のメソッド生やすのも割とスマートに解ける

ので基本的には後者のやり方でヘルパ使ってメソッド生やすのがすっきりすると思う

ただ NestJS で使う前提なら class-validator, class-transformer を使ってバリデーションとか表示データへの整形（Presenter 層っぽいこと）とかをやるし、コードファーストならクラスで書かないと OAS 作れないしでいずれにせよドメインモデルをクラスで定義する必要があるので

- repository: prisma を使ってクラスで再宣言したドメインモデルを返す
- service: prisma に依存せず、repository から受け取ったドメインモデルでビジネスロジックを書く

とかにしてしまうのがスマートな気がする

## 結論

- NestJS 等、Prisma に限らずドメインモデルをクラスで書きたいモチベーションがあるならマッピングする
- それ以外なら、受け取ったオブジェクトに後付けでメソッドを生やす

が良さそう

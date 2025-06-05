// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./yd-lesson-token.sol";

struct Lesson {
    // 返回的课程顺序会因为已删除的课程而错乱，所以需要课程id记录
    uint256 id;
    string name;
    string description;
    uint256 price;
    string link;
    string cover;
    bool isActive;
}

// 用于返回的课程信息结构体
struct LessonInfo {
    uint256 id;
    string name;
    string description;
    uint256 price;
    string cover;
    bool purchased;
}

contract YDCollege is Ownable {
    // 课程映射
    mapping(uint256 => Lesson) public lessons;
    // 课程总数
    uint256 public lessonCount;
    // 用户购买记录
    mapping(address => mapping(uint256 => bool)) public userPurchases;
    // YD代币合约
    YDLessonToken public tokenContract;

    // 事件
    event LessonCreated(uint256 indexed lessonId, string name, uint256 price);
    event LessonUpdated(uint256 indexed lessonId, string name, uint256 price);
    event LessonDeleted(uint256 indexed lessonId);
    event LessonPurchased(address indexed user, uint256 indexed lessonId);

    constructor(address _tokenContract) Ownable() {
        tokenContract = YDLessonToken(_tokenContract);
    }

    // 添加课程（仅所有者）
    function addLesson(
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _link,
        string memory _cover
    ) public onlyOwner {
        lessonCount++;
        lessons[lessonCount] = Lesson({
            id: lessonCount,
            name: _name,
            description: _description,
            price: _price,
            link: _link,
            cover: _cover,
            isActive: true
        });

        emit LessonCreated(lessonCount, _name, _price);
    }

    // 更新课程（仅所有者）
    function updateLesson(
        uint256 _lessonId,
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _link,
        string memory _cover
    ) public onlyOwner {
        require(_lessonId <= lessonCount && _lessonId > 0, "Invalid lesson ID");

        lessons[_lessonId].name = _name;
        lessons[_lessonId].description = _description;
        lessons[_lessonId].price = _price;
        lessons[_lessonId].link = _link;
        lessons[_lessonId].cover = _cover;

        emit LessonUpdated(_lessonId, _name, _price);
    }

    // 删除课程（仅所有者）
    function deleteLesson(uint256 _lessonId) public onlyOwner {
        require(_lessonId <= lessonCount && _lessonId > 0, "Invalid lesson ID");
        require(lessons[_lessonId].isActive, "Lesson is already inactive");

        lessons[_lessonId].isActive = false;
        emit LessonDeleted(_lessonId);
    }

    // 获取所有上线的课程
    function getActiveLessons(
        address _user
    ) public view returns (LessonInfo[] memory) {
        // 计算活跃课程数量
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= lessonCount; i++) {
            if (lessons[i].isActive) {
                activeCount++;
            }
        }

        // 创建结果数组
        LessonInfo[] memory activeLessons = new LessonInfo[](activeCount);
        uint256 currentIndex = 0;

        // 填充结果数组
        for (uint256 i = 1; i <= lessonCount; i++) {
            if (lessons[i].isActive) {
                Lesson memory lesson = lessons[i];
                activeLessons[currentIndex] = LessonInfo({
                    id: i,
                    name: lesson.name,
                    description: lesson.description,
                    price: lesson.price,
                    cover: lesson.cover,
                    purchased: userPurchases[_user][i]
                });
                currentIndex++;
            }
        }

        return activeLessons;
    }

    // 购买课程
    function purchaseLesson(uint256 _lessonId) public {
        require(_lessonId <= lessonCount && _lessonId > 0, "Invalid lesson ID");
        require(lessons[_lessonId].isActive, "Lesson is not active");
        require(
            !userPurchases[msg.sender][_lessonId],
            "Lesson already purchased"
        );

        uint256 price = lessons[_lessonId].price;
        require(
            tokenContract.balanceOf(msg.sender) >= price,
            "Insufficient YD tokens"
        );

        // 转移代币 - 使用 transferFrom，需要用户先调用 approve
        require(
            tokenContract.transferFrom(msg.sender, address(this), price),
            "Token transfer failed"
        );

        // 记录购买
        userPurchases[msg.sender][_lessonId] = true;

        emit LessonPurchased(msg.sender, _lessonId);
    }

    // 获取用户所有购买的课程
    function getUserPurchasedLessons(
        address _user
    ) public view returns (Lesson[] memory) {
        // 获取用户购买课程数量
        uint256 purchasedCount = 0;
        for (uint256 i = 1; i <= lessonCount; i++) {
            if (userPurchases[_user][i]) {
                purchasedCount++;
            }
        }
        Lesson[] memory purchasedLessons = new Lesson[](purchasedCount);
        uint256 tempIndex = 0;
        for (uint256 i = 1; i <= lessonCount; i++) {
            if (userPurchases[_user][i]) {
                purchasedLessons[tempIndex] = lessons[i];
                tempIndex++;
            }
        }
        return purchasedLessons;
    }

    // 添加提取YD币的函数
    function withdrawYDTokens() public onlyOwner {
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");

        require(
            tokenContract.transfer(owner(), balance),
            "Token transfer failed"
        );
    }

    // 获取课程详情（漏了验证当前用户是否拥有该课程）
    function getLesson(uint256 _lessonId) public view returns (Lesson memory) {
        require(_lessonId <= lessonCount && _lessonId > 0, "Invalid lesson ID");
        return lessons[_lessonId];
    }
}

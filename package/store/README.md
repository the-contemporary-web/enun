# @enun/store

```ts
class AchievementStoreClass {
  initialAchievement: Achievement;
  memoStore: ContentStore;

  constructor({ initialAchievement }: { initialAchievement: Achievement }) {
    this.initialAchievement = initialAchievement;
    this.memoStore = ContentStore.use({
      content: initialAchievement.type === "MEMO" ? initialAchievement.memo : undefined,
    });
  }

  toggleAchievement(prev: AchievementStore) {
    const { ahchievement } = prev;
    if (achievement.type !== "TOGGLE") return prev;
    return {
      achievement: {
        ...achievement,
        done: !prev.achievement.done,
      },
    };
  }
  getMemoStore(prev: AchievementStore) {
    return this.memoReducer;
  }

  reducer(prev) {
    return {
      achievement: this.initialAchievement,
      toggleAchievement: this.toggleAchievement,
      getMemoStore: this.getMemoStore,
    };
  }

  destroy() {
    this.memoStore.destroy();
  }
}

const AchievementStore = storeFromClass(AchievementStoreClass);

return {
  AchievementStore,
};
```

```ts
AchievementStore;
```

```ts
type;
```

```tsx
const MemoItem = memo => {
  const memoStore = useMemoStore(memo);

  return (
    <StoreProvider store={[() => memoStore, memoStore.getContentStore]}>
      <Div className={cx("MemoItem")}>
        <MemoTitleInput />
        <ContentInput />
      </Div>
    </StoreProvider>
  );
};
```

import { create } from "zustand";

interface ClaimDataStore {
	claimDataList: (string | number)[][];
	setClaimDataList: (claimDataList: (string | number)[][]) => void;
	[Symbol.iterator](): Iterator<(string | number)[]>;
}

const useClaimDataStore = create<ClaimDataStore>((set) => ({
	claimDataList: [],
	setClaimDataList: (claimDataList) => set({ claimDataList }),
	[Symbol.iterator]() {
		let index = 0;
		const data = this.claimDataList;

		return {
			next: (): IteratorResult<(string | number)[]> => {
				if (index < data.length) {
					return { value: data[index++], done: false };
				} else {
					return { value: undefined, done: true };
				}
			},
		};
	},
}));

// type ClaimDataStoreState = {
//     claimDataList: (string | number)[][];
// }

// type ClaimDataStoreActions = {
//     setClaimDataList: (claimDataList: (string | number)[][]) => void;
// }

// type ClaimDataStore = ClaimDataStoreState & ClaimDataStoreActions;

// const useClaimDataStore = create<ClaimDataStore>()((set) => ({
//     claimDataList: [],
//     setClaimDataList: (claimDataList) => set({ claimDataList }),
// }));

// type ClaimDataStoreState = (string | number)[][];

// const useClaimDataStore = create<ClaimDataStoreState>()(() => [])

export { useClaimDataStore };



let navigatorRef = null;

export function setTopLevelNavigator(ref) {
  navigatorRef = ref;
}

export function navigate(routeName, params) {
  if (navigatorRef) {
    navigatorRef.navigate(routeName, params);
  }
}

export function goBack() {
  if (navigatorRef) {
    navigatorRef.goBack();
  }
}



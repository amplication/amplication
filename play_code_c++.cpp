#include <iostream>
#include <algorithm>
using namespace std;

// int main(int argc, char const *argv[])
// {
//     int n ;
//     cin>>n;
//     int array [n];
//     for (int i = 0; i <n; i++)
//     {
//            cin>>array[i];
//     }
//     for (int i = 0; i <= n; i++)
//     {
//          cout<<array[i];
//     }

//       return 0;
// }

// int main(int argc, char const *argv[])
// {
//         int n;
//       cin >> n;
//       int array[n];
//       for (int i = 0; i < n; i++)
//       {
//             cin >> array[i];
//       }
//       int min = INT_MAX;
//       int max = INT_MIN;
//       for (int  i = 0; i < n; i++)
//       {
//         if (array[i]<min)
//         {
//               min=array[i];
//         }
//         if (array[i]>max)
//         {
//               max =array[i];
//         }

//       }
//       cout<<min;
//       cout<<max;
//       return 0;
// }

// int linerseach(int arr[],int n ,int key)
// {
//       for (int i = 0; i < n; i++)
//       {
//           if (key==arr[i])
//           {
//              return i;
//           }
//           else
//           {
//                 return -1;
//           }
//       }

// }
// int main(int argc, char const *argv[])
// {
//       int n ;
//       cin>>n;
//       int arr[n];
//       for(int i = 0 ; i <n ; i++)
//       {
//             cin>>arr[i];
//       }
//       int key ;
//       cin>>key;
// cout<<linerseach(arr,n,key);
//       return 0;
// }
// int binarysearch(int arr[], int n)
// {
// for (int i = 0; i <n; i++)
// {
//       for (int j = 0;j < n; j++)
//       {
//           if (arr[i]>arr[j])
//       {
//             int temp = arr[j];
//             arr[j]=arr[i];
//             arr[i]=temp;
//       }
//       }
//       cout<<arr[i]<<" ";
// }

// }
// int main(int argc, char const *argv[])
// {
//       int n;
//       cin >> n;
//       int arr[n];
//       for (int i = 0; i < n; i++)
//       {
//             cin >> arr[i];
//       }
//     cout<<binarysearch(arr,n);
//       return 0;
// }

// SORTING IN ARRAY'S

// int main(int argc, char const *argv[])
// {
//       int n;
//       cin >> n;

//       int arr[n];
//       for (int i = 0; i < n; i++)
//       {
//             cin >> arr[i];
//       }
//       for (int i = 0; i < n; i++)
//       {
//             for (int j = i; j < n; j++)
//             {
//                   if (arr[i] > arr[j])
//                   {
//                         int temp = arr[j];
//                         arr[j] = arr[i];
//                         arr[i] = temp;
//                   }
                
//           }
//            cout << arr[i] << " ";   
//       }

//       return 0;
// }

// insertion sort 

// int main(int argc, char const *argv[])
// {
           

//       int n ;
//       cin>>n;
//       int arr[n];
//       for(int i = 0 ; i <n ; i++)
//       {
//             cin>>arr[i];

//       }
//  int mx = INT16_MIN;
//             int minn = INT16_MAX;
//  for(int i = 0 ; i <n;i++)
//  {
//        mx=max(mx,arr[i]);
//        minn =min(minn,arr[i]);
       
//  }
//  cout<<mx<<endl<<minn;
//       return 0;
// }


// //BINARY SEARCH

// int linersearch (int arr[], int n , int key )
// {
//       for (int i = 0; i < n; i++)
//       {
//             if (arr[i]==key)
//             {
//                   return i ;
//             }
//       }
//                   return -1 ;
            
// }
// int main(int argc, char const *argv[])
// {
//       int n ;
//       cin>>n;
//       int arr[n];
//       for(int i = 0 ; i<n ; i++)
//       {
//             cin>>arr[i];
//       }
//       int key ;
//       cin>>key;

// cout<<linersearch(arr,n, key)<<endl;

//       return 0;
// }

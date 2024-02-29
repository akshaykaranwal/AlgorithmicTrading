#include <iostream>

using namespace std;

int main()
{
    if (!printf("hello "))
    {
        cout << "hello";
    }
    else
    {
        cout << "world";
    }
}